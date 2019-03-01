
export default class CloudProjectCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $state,
    $stateParams,
    $transitions,
    CucCucControllerHelper,
    ovhUserPref,
    OvhApiCloud,
    CloudProjectRightService,
    TAREGT,
  ) {
    this.serviceName = $stateParams.projectId;
    this.onboardingKey = 'SHOW_PCI_ONBOARDING';

    this.$transitions = $transitions;

    this.CucControllerHelper = CucControllerHelper;
    this.ovhUserPref = ovhUserPref;
    this.OvhApiCloud = OvhApiCloud;
    this.CloudProjectRightService = CloudProjectRightService;

    $scope.TARGET = TARGET;

    this.loaders = {
      project: false,
    };

    this.model = {
      project: null,
      hasWriteRight: true,
    };

    this.includes = function includes(stateName) {
      return $state.includes(stateName);
    };

    // reference to our rootScope state change listener
    this.stateChangeListener = null;

    // when controller is destroyed we must remove global state change listener
    $scope.$on('$destroy', () => {
      if (this.stateChangeListener) {
        this.stateChangeListener();
      }
    });
  }

  openOnboarding() {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'app/cloud/project/onboarding/onboarding-pci.html',
        controller: 'pciSlideshowCtrl',
        controllerAs: '$ctrl',
        backdrop: 'static',
      },
    });
  }

  $onInit() {
    this.loaders.project = true;

    this.ovhUserPref.getValue(this.onboardingKey)
      .then(({ value }) => {
        if (value) {
          this.openOnboarding();
        }
      })
      .catch((err) => {
        // Check error status and if key is there in error message
        if (err.status === 404 && err.data.message.includes(this.onboardingKey)) {
          this.openOnboarding();
        }
      });

    // get current project
    if (this.serviceName) {
      this.OvhApiCloud.Project().v6().get({
        serviceName: this.serviceName,
      }).$promise
        .then((project) => {
          this.model.project = project;
          // if project is suspended, redirect to error page
          if (this.model.project.status === 'suspended' || this.model.project.status === 'creating') {
            this.$state.go('iaas.pci-project.details');
          } else {
            this.CloudProjectRightService.userHaveReadWriteRights(this.serviceName)
              .then((hasWriteRight) => {
                this.model.hasWriteRight = hasWriteRight;
              });
          }
        })
        .catch(() => this.$state.go('iaas.pci-project.details'))
        .finally(() => {
          this.loaders.project = false;
        });
    } else {
      this.$state.go('iaas.pci-project-new');
      return;
    }

    // before a state change, check if the destination project is suspended,
    // if it's the case just redirect to the error page
    this.stateChangeListener = this.$transitions.onStart({}, (transition) => {
      const toState = transition.to();
      const toParams = transition.params();
      // avoid infinite state redirection loop
      if (toState && toState.name === 'iaas.pci-project.details') {
        return;
      }
      // check if project is loaded
      if (!this.model.project) {
        return;
      }
      // redirection is only for suspended projects
      if (this.model.project.status !== 'suspended' && this.model.project.status !== 'creating') {
        return;
      }
      if (this.model.project.project_id === toParams.projectId) {
        this.$state.go('iaas.pci-project.details');
      }
    });
  }

};
