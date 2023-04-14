// Copyright 2023, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import LinkableProperty from '../../axon/js/LinkableProperty.js';
import myGreenhouseEffect from './myGreenhouseEffect.js';

type StringsType = {
  'my-greenhouse-effect': {
    'titleStringProperty': LinkableProperty<string>;
  };
  'screen': {
    'nameStringProperty': LinkableProperty<string>;
  }
};

const MyGreenhouseEffectStrings = getStringModule( 'MY_GREENHOUSE_EFFECT' ) as StringsType;

myGreenhouseEffect.register( 'MyGreenhouseEffectStrings', MyGreenhouseEffectStrings );

export default MyGreenhouseEffectStrings;
