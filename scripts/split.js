const program = require('commander');
const execa = require('execa');
const path = require('path');

const listRemoteBranches = () => execa
  .shell('git ls-remote --heads -q origin')
  .then(({ stdout }) => stdout.split('\n').map((head) => {
    const [, ref] = head.split('\t');
    return ref.replace('refs/heads/', '');
  }))
  .then(branches => [
    branches.filter(branch => branch.indexOf('pkg/') === 0),
    branches.filter(branch => branch.indexOf('pkg/') !== 0),
  ]);

const getModulesInfos = () => execa
  .shell('lerna ls -l --json')
  .then(({ stdout }) => {
    const packages = JSON.parse(stdout);
    return packages.map(pkg => pkg.name.split('/')[1]);
  });

const cleanSplit = () => Promise
  .all([
    listRemoteBranches(),
    getModulesInfos(),
  ])
  .then(([[remoteSplittedBranches, remoteBranches], modulesInfos]) => {
    const splittedBranches = remoteBranches
      .reduce((all, branch) => [
        ...all,
        ...modulesInfos
          .map((module) => {
            if (branch === 'master') {
              return `pkg/${module}`;
            }
            return `pkg/${module}-${branch.replace('/', '-')}`;
          }),
      ], []);

    return remoteSplittedBranches.filter(x => !splittedBranches.includes(x));
  })
  .then(branches => Promise.all(
    branches.map(branch => execa
      .shell(`git push origin --delete ${branch}`)
      .then(() => console.log(`  * ${branch} deleted`))),
  ));

const splitModules = () => execa
  .shell('git rev-parse --abbrev-ref HEAD')
  .then(({ stdout: repoBranchName }) => {
    let branchNameSuffix = '';
    if (repoBranchName !== 'master') {
      branchNameSuffix = `-${repoBranchName.replace('/', '-')}`;
    }
    return execa
      .shell('lerna ls -l --json')
      .then(({ stdout }) => {
        const packages = JSON.parse(stdout);

        return Promise.all(
          packages.map(
            (pkg) => {
              const [, packageName] = pkg.name.split('/');
              const modulePath = path.relative(process.cwd(), pkg.location);
              const branchName = `pkg/${packageName}${branchNameSuffix}`;
              return execa
                .shell(`git subtree split --prefix=${modulePath} -b ${branchName}`)
                .then(() => console.log(`${pkg.name} splitted in ${branchName}`))
                .then(() => execa.shell(`git push --force origin ${branchName}`))
                .then(() => console.log(`  * ${branchName} pushed to origin`));
            },
          ),
        );
      });
  });


program
  .option('--clean', 'clean splitted branches')
  .action(() => {
    (program.clean ? cleanSplit() : Promise.resolve()).then(() => splitModules());
  })
  .parse(process.argv);
