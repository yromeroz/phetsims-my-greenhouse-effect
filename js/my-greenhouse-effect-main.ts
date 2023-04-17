// Copyright 2023, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Yidier Romero
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
// import MyGreenhouseEffectScreen from './my-greenhouse-effect/MyGreenhouseEffectScreen.js';
// import LayerModelScreen from './layer-model/LayerModelScreen.js';
import PhotonsScreen from './photons/PhotonsScreen.js';
import MyGreenhouseEffectStrings from './MyGreenhouseEffectStrings.js';
import './common/MyGreenhouseEffectQueryParameters.js';

// Launch the sim. Beware that scenery Image nodes created outside simLauncher.launch() will have zero bounds
// until the images are fully loaded. See https://github.com/phetsims/coulombs-law/issues/70#issuecomment-429037461
// simLauncher.launch( () => {
//
//   const titleStringProperty = MyGreenhouseEffectStrings[ 'my-greenhouse-effect' ].titleStringProperty;
//
//   const screens = [
//     new LayerModelScreen( Tandem.ROOT.createTandem( 'layerModelScreen' ) ),
//     new PhotonsScreen( Tandem.ROOT.createTandem( 'photonsScreen' ) ),
//     // new MyGreenhouseEffectScreen( {
//     //   tandem: Tandem.ROOT.createTandem( 'myGreenhouseEffectScreen' ) } ),
//     new MyGreenhouseEffectScreen( Tandem.ROOT.createTandem( 'myGreenhouseEffectScreen' ) )
//   ];
//
//   const options: SimOptions = {
//
//     // Enabled for high-performance Sprites
//     webgl: true,
//
//     credits: {
//       leadDesign: 'Kathy Perkins, Amy Rouinfar',
//       softwareDevelopment: 'John Blanco, Jesse Greenberg, Sam Reid',
//       team: 'Wendy Adams, Danielle Harlow, Kelly Lancaster, Trish Loeblein, Robert Parson, Carl Wieman',
//       qualityAssurance: 'Jaron Droder, Clifford Hardin, Amanda McGarry, Emily Miller, Nancy Salpepi,<br>Marla Schulz, Kathryn Woessner',
//       graphicArts: '',
//       soundDesign: 'Ashton Morris',
//       thanks: 'Dedicated to the memory of Ron LeMaster.'
//     }
//   };
//
//   const sim = new Sim( titleStringProperty, screens, options );
//   sim.start();
// } );

const myGreenhouseEffectTitleStringProperty = MyGreenhouseEffectStrings[ 'my-greenhouse-effect' ].titleStringProperty;

const simOptions: SimOptions = {

  // Enabled for high-performance Sprites
  webgl: true,

  credits: {
    leadDesign: 'John Doe',
    softwareDevelopment: 'John Doe',
    team: 'John Doe, Yidier Romero',
    // qualityAssurance: 'Jaron Droder, Clifford Hardin, Amanda McGarry, Emily Miller, Nancy Salpepi,<br>Marla Schulz, Kathryn Woessner',
    // graphicArts: '',
    // soundDesign: 'Ashton Morris',
    thanks: 'Dedicated to Hazel Alpízar and Mastercard Sponsor.'
  }
};

// Launch the sim.  Beware that scenery Image nodes created outside simLauncher.launch() will have zero bounds until the
// images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70.
simLauncher.launch( () => {
  const sim = new Sim(
    myGreenhouseEffectTitleStringProperty,
    [
      // new MyGreenhouseEffectScreen( Tandem.ROOT.createTandem( 'myGreenhouseEffectScreen' ) ),
      new PhotonsScreen( Tandem.ROOT.createTandem( 'photonsScreen' ) ) //,
      // new LayerModelScreen( Tandem.ROOT.createTandem( 'layerModelScreen' ) )
    ],
    simOptions
  );
  sim.start();
} );