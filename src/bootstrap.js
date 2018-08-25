/* eslint-disable camelcase */

import './directives/preventParentScroll.directive';
import { fsm } from './recipe';

export default function bootstrap() {
  fsm.init();
}
