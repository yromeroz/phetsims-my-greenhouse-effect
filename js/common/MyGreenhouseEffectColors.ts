// Copyright 2023, University of Colorado Boulder

/**
 * Defines the colors for this sim.
 *
 * All simulations should have a Colors.js file, see https://github.com/phetsims/scenery-phet/issues/642.
 *
 * For static colors that are used in more than one place, add them here.
 *
 * For dynamic colors that can be controlled via colorProfileProperty.js, add instances of ProfileColorProperty here,
 * each of which is required to have a default color. Note that dynamic colors can be edited by running the sim from
 * phetmarks using the "Color Edit" mode.
 *
 * @author Yidier Romero
 */

import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import myGreenhouseEffect from '../myGreenhouseEffect.js';

const MyGreenhouseEffectColors = {

  // Background color for screens in this sim
  // screenBackgroundColorProperty: new ProfileColorProperty( myGreenhouseEffect, 'background', {
  //   default: 'white'
  // } )
  screenBackgroundColorProperty: new ProfileColorProperty(
    myGreenhouseEffect,
    'background',
    {
      default: new Color( 254, 252, 231 )
    },
    {
      tandem: Tandem.COLORS.createTandem( 'screenBackgroundColorProperty' )
    }
  ),
  sunlightColorProperty: new ProfileColorProperty(
    myGreenhouseEffect,
    'sunlight',
    {
      default: Color.YELLOW
    },
    {
      tandem: Tandem.COLORS.createTandem( 'sunlightColorProperty' )
    }
  ),
  infraredColorProperty: new ProfileColorProperty(
    myGreenhouseEffect,
    'infrared',
    {
      default: Color.RED
    },
    {
      tandem: Tandem.COLORS.createTandem( 'infraredColorProperty' )
    }
  ),
  energyLegendBackgroundColorProperty: new ProfileColorProperty(
    myGreenhouseEffect,
    'energyLegendBackground',
    {
      default: Color.BLACK
    },
    {
      tandem: Tandem.COLORS.createTandem( 'energyLegendBackgroundColorProperty' )
    }
  ),
  controlPanelBackgroundColorProperty: new ProfileColorProperty(
    myGreenhouseEffect,
    'controlPanelBackground',
    {
      default: Color.WHITE
    },
    {
      tandem: Tandem.COLORS.createTandem( 'controlPanelBackgroundColorProperty' )
    }
  ),
  radioButtonGroupSelectedStrokeColorProperty: new ProfileColorProperty(
    myGreenhouseEffect,
    'radioButtonGroupSelectedStroke',
    {
      default: new Color( 0, 148, 189 )
    },
    {
      tandem: Tandem.COLORS.createTandem( 'radioButtonGroupSelectedStrokeColorProperty' )
    }
  )
};

myGreenhouseEffect.register( 'MyGreenhouseEffectColors', MyGreenhouseEffectColors );
export default MyGreenhouseEffectColors;