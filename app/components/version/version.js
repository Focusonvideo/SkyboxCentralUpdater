'use strict';

angular.module('SkyboxApp.version', [
  'SkyboxApp.version.interpolate-filter',
  'SkyboxApp.version.version-directive'
])

.value('version', '0.1');
