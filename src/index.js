import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import observe from 'data-observer';
import dom from './dom';
import createElement from './create-element';
import {setScheduler} from './scheduler-assignment';

export {observe, dom, createElement, setScheduler, diff, patch};
