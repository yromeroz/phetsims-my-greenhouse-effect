// Copyright 2023, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Yidier Romero
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import MyGreenhouseEffectScreen from './my-greenhouse-effect/MyGreenhouseEffectScreen.js';
import MyGreenhouseEffectStrings from './MyGreenhouseEffectStrings.js';
import './common/MyGreenhouseEffectQueryParameters.js';

// Launch the sim. Beware that scenery Image nodes created outside simLauncher.launch() will have zero bounds
// until the images are fully loaded. See https://github.com/phetsims/coulombs-law/issues/70#issuecomment-429037461
simLauncher.launch( () => {

  const titleStringProperty = MyGreenhouseEffectStrings[ 'my-greenhouse-effect' ].titleStringProperty;

  const screens = [
    new MyGreenhouseEffectScreen( { tandem: Tandem.ROOT.createTandem( 'myGreenhouseEffectScreen' ) } )
  ];

  const options: SimOptions = {

    //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
    credits: {
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      contributors: '',
      qualityAssurance: '',
      graphicArts: '',
      soundDesign: '',
      thanks: ''
    }
  };

  const sim = new Sim( titleStringProperty, screens, options );
  sim.start();
} );