// Copyright 2022, University of Colorado Boulder

/**
 * GreenhouseEffectOptions defines the global options for this simulation.  Depending on the particulars, these can be
 * controlled via phet-io, query parameters, and/or from the "Options..." dialog.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import Tandem from '../../../tandem/js/Tandem.js';
import myGreenhouseEffect from '../myGreenhouseEffect.js';
import MyGreenhouseEffectQueryParameters from './MyGreenhouseEffectQueryParameters.js';

// constants
const optionsTandem = Tandem.GLOBAL_VIEW.createTandem( 'options' );

const GreenhouseEffectOptions = {

  cueingArrowsEnabledProperty: new BooleanProperty( MyGreenhouseEffectQueryParameters.cueingArrowsEnabled, {
    tandem: optionsTandem.createTandem( 'cueingArrowsEnabledProperty' ),
    phetioDocumentation: 'shows cueing arrows on draggable elements'
  } )

};

myGreenhouseEffect.register( 'GreenhouseEffectOptions', GreenhouseEffectOptions );
export default GreenhouseEffectOptions;
