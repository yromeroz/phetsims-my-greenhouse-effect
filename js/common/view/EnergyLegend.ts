// Copyright 2021-2022, University of Colorado Boulder

/**
 * Legend in GreenhouseEffect to show representations of sunlight and infrared energy.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import { Shape } from '../../../../kite/js/imports.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import { GridBox, Image, Path, PathOptions, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import infraredPhoton_png from '../../../images/infraredPhoton_png.js';
import visiblePhoton_png from '../../../images/visiblePhoton_png.js';
import myGreenhouseEffect from '../../myGreenhouseEffect.js';
import MyGreenhouseEffectStrings from '../../MyGreenhouseEffectStrings.js';
import MyGreenhouseEffectColors from '../MyGreenhouseEffectColors.js';
import MyGreenhouseEffectConstants from '../MyGreenhouseEffectConstants.js';

// constants
const WAVE_ICON_AMPLITUDE = 7;
const MAX_PHOTON_WIDTH = 15;

// An empirically determined value for the size of the label-icon portion of the panel, used to keep the alignment
// consistent between the wave and photon versions of this legend.
const TOTAL_LEGEND_AREA_HEIGHT = 45;

// margin for panel contents
const PANEL_MARGIN = 8;

// The legend can display photon or wave representation of energy, see energyRepresentation option
class EnergyRepresentation extends EnumerationValue {
  public static readonly PHOTON = new EnergyRepresentation();
  public static readonly WAVE = new EnergyRepresentation();
  public static readonly enumeration = new Enumeration( EnergyRepresentation );
}

type SelfOptions = {
  energyRepresentation?: EnergyRepresentation;
};
export type EnergyLegendOptions = SelfOptions & PanelOptions;

class EnergyLegend extends Panel {

  /**
   * @param width - width of the legend, it needs to be wider than its contents for layout in screen view
   * @param [providedOptions]
   */
  public constructor( width: number, providedOptions?: EnergyLegendOptions ) {

    const options = optionize<EnergyLegendOptions, SelfOptions, PanelOptions>()( {

      // the energy icons will either display a photon or wave, depending on this option
      energyRepresentation: EnergyRepresentation.PHOTON,

      // Panel options
      fill: MyGreenhouseEffectColors.energyLegendBackgroundColorProperty,
      minWidth: width,
      xMargin: PANEL_MARGIN,
      yMargin: PANEL_MARGIN,

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: MyGreenhouseEffectStrings.a11y.energyLegend.titleStringProperty,
      descriptionTagName: 'p',
      descriptionContent: MyGreenhouseEffectStrings.a11y.energyLegend.inObservationWindowStringProperty,

      // phet-io
      tandem: Tandem.REQUIRED
    }, providedOptions );

    // title
    const titleText = new Text( MyGreenhouseEffectStrings.energyLegend.titleStringProperty, {
      font: MyGreenhouseEffectConstants.TITLE_FONT,
      fill: 'white',
      maxWidth: width - 2 * PANEL_MARGIN,
      tandem: options.tandem.createTandem( 'titleText' )
    } );

    // options for legend labels
    const labelOptions = {
      font: MyGreenhouseEffectConstants.LABEL_FONT,
      fill: 'white',
      maxWidth: width * 0.75
    };

    // labels
    const sunlightLabelText = new Text(
      MyGreenhouseEffectStrings.sunlightStringProperty,
      combineOptions<TextOptions>( {}, labelOptions, { tandem: options.tandem.createTandem( 'sunlightLabelText' ) } )
    );
    const infraredLabelText = new Text(
      MyGreenhouseEffectStrings.infraredStringProperty,
      combineOptions<TextOptions>( {}, labelOptions, { tandem: options.tandem.createTandem( 'infraredLabelText' ) } )
    );

    // create the icons
    let sunlightIcon;
    let infraredIcon;
    if ( options.energyRepresentation === EnergyRepresentation.WAVE ) {
      const sunlightWavelength = 15;
      const sunlightWavelengths = 3.5;
      const infraredWavelengths = 2.5;
      sunlightIcon = createWaveIcon( sunlightWavelength, sunlightWavelengths, {
        stroke: MyGreenhouseEffectColors.sunlightColorProperty
      } );
      infraredIcon = createWaveIcon(
        sunlightWavelength * sunlightWavelengths / infraredWavelengths,
        infraredWavelengths,
        { stroke: MyGreenhouseEffectColors.infraredColorProperty }
      );
    }
    else {
      const photonIconOptions = { maxWidth: MAX_PHOTON_WIDTH };
      sunlightIcon = new Image( visiblePhoton_png, photonIconOptions );
      infraredIcon = new Image( infraredPhoton_png, photonIconOptions );
    }

    // Calculate the vertical spacing for the grid box in a way that will keep it consistent between the wave and photon
    // representations.
    const gridBoxYSpacing = TOTAL_LEGEND_AREA_HEIGHT -
                            Math.max( sunlightLabelText.height, sunlightIcon.height ) -
                            Math.max( infraredLabelText.height, infraredIcon.height );

    assert && assert( gridBoxYSpacing >= 0, 'insufficient space for legend area' );

    // Create a grid box to align the labels and the icons that represent the different light wavelengths.
    const gridBox = new GridBox( {
      rows: [
        [ sunlightLabelText, sunlightIcon ],
        [ infraredLabelText, infraredIcon ]
      ],
      xSpacing: 8,
      ySpacing: gridBoxYSpacing,
      layoutOptions: {
        align: 'left'
      },
      xAlign: 'right',
      yAlign: 'center',
      maxWidth: width - PANEL_MARGIN * 2
    } );

    const content = new VBox( {
      spacing: 7,
      children: [ titleText, gridBox ],

      // pdom
      tagName: 'ul'
    } );

    super( content, options );
  }

  // static values
  public static readonly EnergyRepresentation = EnergyRepresentation;
}

/**
 * Creates a wave icon for the legend.
 * @param wavelength - wavelength for the wave icon in view coordinates
 * @param wavelengthsToDraw - how many wavelengths to draw for the icon
 * @param [options] - options for the wave Path
 */
const createWaveIcon = ( wavelength: number, wavelengthsToDraw: number, options?: PathOptions ) => {

  options = combineOptions<PathOptions>( {
    lineWidth: 1.5
  }, options );

  const iconLength = wavelength * wavelengthsToDraw;
  const wavelengthRadians = wavelength / ( Math.PI * 2 );

  const numberOfWavePoints = 100;
  const waveShape = new Shape();
  waveShape.moveTo( 0, -Math.cos( 0 ) * WAVE_ICON_AMPLITUDE );
  for ( let x = 0; x < iconLength; x += iconLength / numberOfWavePoints ) {
    waveShape.lineTo( x, -Math.cos( x / wavelengthRadians ) * WAVE_ICON_AMPLITUDE );
  }

  return new Path( waveShape, options );
};

myGreenhouseEffect.register( 'EnergyLegend', EnergyLegend );
export default EnergyLegend;