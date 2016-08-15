'use strict';
import {UtilService} from './util.service';

export default angular.module('spotifivisionApp.util', [])
  .factory('Util', UtilService)
  .name;
