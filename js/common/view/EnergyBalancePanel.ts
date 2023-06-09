// Copyright 2021-2023, University of Colorado Boulder

/**
 * EnergyBalancePanel is a panel that portrays a plot of the energy balance at a point in the atmosphere, showing the
 * energy in, energy out, and the net energy.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import AxisLine from '../../../../bamboo/js/AxisLine.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import UpDownArrowPlot from '../../../../bamboo/js/UpDownArrowPlot.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import { Node, scenery, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import SoundLevelEnum from '../../../../tambo/js/SoundLevelEnum.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import MyGreenhouseEffectStrings from '../../MyGreenhouseEffectStrings.js';
import MyGreenhouseEffectConstants from '../MyGreenhouseEffectConstants.js';
import EnergyAbsorbingEmittingLayer from '../model/EnergyAbsorbingEmittingLayer.js';
import SunEnergySource from '../model/SunEnergySource.js';
import EnergyDescriber from './describers/EnergyDescriber.js';
import EnergyBalanceSoundGenerator from './EnergyBalanceSoundGenerator.js';

// constants
const BAR_COLOR = 'rgb(0,187,115)';
const BAR_STROKE = 'grey';
const PLOT_VIEW_WIDTH = 100; // view coordinates
const PLOT_VIEW_HEIGHT = 120; // view coordinates

// types
type SelfOptions = EmptySelfOptions;
export type EnergyBalancePanelOptions = SelfOptions & PanelOptions;

class EnergyBalancePanel extends Panel {

  private readonly energyBalanceSoundGenerator: EnergyBalanceSoundGenerator;
  private readonly balancePlot: EnergyBalancePlot;

  /**
   * @param energyBalanceVisibleProperty - a Property that controls whether this Panel is visible in the view
   * @param netEnergyInProperty
   * @param netEnergyOutProperty
   * @param inRadiativeBalanceProperty
   * @param sunIsShiningProperty
   * @param [providedOptions]
   */
  public constructor( energyBalanceVisibleProperty: Property<boolean>,
                      netEnergyInProperty: Property<number>,
                      netEnergyOutProperty: Property<number>,
                      inRadiativeBalanceProperty: Property<boolean>,
                      sunIsShiningProperty: Property<boolean>,
                      providedOptions?: EnergyBalancePanelOptions ) {

    const options = optionize<EnergyBalancePanelOptions, SelfOptions, PanelOptions>()( {

      // panel options
      cornerRadius: 5,
      xMargin: 10,
      yMargin: 10,

      // pdom
      tagName: 'div',
      labelTagName: 'h4',
      labelContent: MyGreenhouseEffectStrings.energyBalancePanel.titleStringProperty
    }, providedOptions );

    // title
    const titleText = new Text( MyGreenhouseEffectStrings.energyBalancePanel.titleStringProperty, {
      font: MyGreenhouseEffectConstants.TITLE_FONT,
      maxWidth: 150
    } );
    const subTitleText = new Text( MyGreenhouseEffectStrings.energyBalancePanel.subTitleStringProperty, {
      font: MyGreenhouseEffectConstants.CONTENT_FONT,
      maxWidth: 120
    } );
    const titleNode = new VBox( {
      spacing: 5,
      children: [ titleText, subTitleText ]
    } );

    // Energy "In" needs to be plotted in the negative y direction to match other graphics related to energy flux
    // in this sim
    const negatedEnergyInProperty: TReadOnlyProperty<number> = new DerivedProperty(
      [ netEnergyInProperty ],
      netEnergyIn => -netEnergyIn
    );

    // TODO: Use model.netInflowOfEnergyProperty instead of this custom one.
    const netEnergyProperty: TReadOnlyProperty<number> = new DerivedProperty(
      [ negatedEnergyInProperty, netEnergyOutProperty ],
      ( netIn, netOut ) => netIn + netOut
    );

    // the plot
    const balancePlot = new EnergyBalancePlot( negatedEnergyInProperty, netEnergyOutProperty, netEnergyProperty );

    const content = new VBox( {
      spacing: 5,
      children: [ titleNode, balancePlot ]
    } );

    super( content, options );

    // Make the plot available to the step method.
    this.balancePlot = balancePlot;

    // listeners
    energyBalanceVisibleProperty.link( visible => {
      this.visible = visible;
    } );

    // sound generation
    this.energyBalanceSoundGenerator = new EnergyBalanceSoundGenerator( netEnergyProperty, inRadiativeBalanceProperty, {
      initialOutputLevel: 0.3,
      enableControlProperties: [ energyBalanceVisibleProperty ]
    } );
    soundManager.addSoundGenerator( this.energyBalanceSoundGenerator, { sonificationLevel: SoundLevelEnum.EXTRA } );

    // pdom
    Multilink.multilink( [ netEnergyProperty, inRadiativeBalanceProperty, sunIsShiningProperty ], ( netEnergy, inRadiativeBalance, sunIsShining ) => {

      if ( !sunIsShining ) {

        // describe no flow of energy and a hint to start sunlight to make use of the energy balance panel
        this.descriptionContent = MyGreenhouseEffectStrings.a11y.noFlowOfEnergyHintDescriptionStringProperty;
      }
      else {
        this.descriptionContent = EnergyDescriber.getNetEnergyAtAtmosphereDescription( -netEnergy, inRadiativeBalance );
      }
    } );
  }

  /**
   * time-based behavior
   * @param dt - delta time, in seconds
   */
  public step( dt: number ): void {
    this.energyBalanceSoundGenerator.step( dt );
    this.balancePlot.update();
  }
}

/**
 * Inner class for the actual Plot, using bamboo.
 */
class EnergyBalancePlot extends Node {
  private readonly barPlot: UpDownArrowPlot;
  private readonly netEnergyInProperty: TReadOnlyProperty<number>;
  private readonly netEnergyOutProperty: TReadOnlyProperty<number>;
  private readonly netEnergyProperty: TReadOnlyProperty<number>;

  /**
   * @param netEnergyInProperty - Representing net energy in
   * @param netEnergyOutProperty - Representing net energy out
   * @param netEnergyProperty - Representing net energy of the system
   */
  public constructor( netEnergyInProperty: TReadOnlyProperty<number>,
                      netEnergyOutProperty: Property<number>,
                      netEnergyProperty: TReadOnlyProperty<number> ) {
    super();

    // position of each bar, in model coordinates
    const inEnergyModelPosition = 0;
    const outEnergyModelPosition = 1;
    const netEnergyModelPosition = 2;
    const horizontalModelRange = new Range( inEnergyModelPosition, netEnergyModelPosition );

    // range of the entire plot, in model watts, based on the max output of the sun
    const verticalModelSpan = SunEnergySource.OUTPUT_ENERGY_RATE * EnergyAbsorbingEmittingLayer.SURFACE_AREA * 2;

    const chartTransform = new ChartTransform( {
      viewWidth: PLOT_VIEW_WIDTH,
      modelXRange: horizontalModelRange,
      viewHeight: PLOT_VIEW_HEIGHT,
      modelYRange: new Range( -verticalModelSpan, verticalModelSpan )
    } );

    // the dataSet for the barPlot gets set in a multilink of the provided energy Properties
    const barPlot = new UpDownArrowPlot( chartTransform, [], {
      pointToPaintableFields: () => {
        return { fill: BAR_COLOR, stroke: BAR_STROKE };
      }
    } );

    const axisLine = new AxisLine( chartTransform, Orientation.HORIZONTAL, {
      stroke: 'grey',
      lineDash: [ 10, 5 ]
    } );

    // labels
    const labelOptions = { font: MyGreenhouseEffectConstants.CONTENT_FONT, maxWidth: 30 };
    const gridLabels = new TickLabelSet( chartTransform, Orientation.HORIZONTAL, 1, {

      // the 'extent' is extra spacing between tick marks and labels, negative value because this is vertically
      // above the plot
      extent: -30,

      // place the labels at the max value of the plot
      value: verticalModelSpan,

      createLabel: ( value: number ) => {
        return value === inEnergyModelPosition ?
               new Text( MyGreenhouseEffectStrings.energyBalancePanel.inStringProperty, labelOptions ) :
               value === outEnergyModelPosition ? new Text( MyGreenhouseEffectStrings.energyBalancePanel.outStringProperty, labelOptions ) :
               new Text( MyGreenhouseEffectStrings.energyBalancePanel.netStringProperty, labelOptions );
      }
    } );

    // contains all plot components and provides consistent bounds as the arrows change size with model data
    const chartRectangle = new ChartRectangle( chartTransform, {
      children: [ axisLine, barPlot, gridLabels ]
    } );
    this.addChild( chartRectangle );

    // The arrows will be clipped if they extend outside the bounds of the plot, and this clipping should make sure
    // that they don't overlap with the labels.  Also, the clip area can't be too small in the x-direction or the edges
    // of the arrow heads can be cut off (see https://github.com/phetsims/greenhouse-effect/issues/240).
    barPlot.clipArea = Shape.bounds( this.bounds.withMinY( gridLabels.bounds.maxY ).dilateX( 5 ) );

    // Make the plot and the energy properties visible to the update method.
    this.barPlot = barPlot;
    this.netEnergyInProperty = netEnergyInProperty;
    this.netEnergyOutProperty = netEnergyOutProperty;
    this.netEnergyProperty = netEnergyProperty;
  }

  /**
   * Update the bar chart.  This is done in a method rather than linking to properties because the latter approach was
   * updating multiple times per frame and causing some performance issues.  See
   * https://github.com/phetsims/greenhouse-effect/issues/265.
   */
  public update(): void {
    this.barPlot.setDataSet( [
      new Vector2( 0, this.netEnergyInProperty.value ),
      new Vector2( 1, this.netEnergyOutProperty.value ),
      new Vector2( 2, this.netEnergyProperty.value )
    ] );
  }
}

scenery.register( 'EnergyBalancePanel', EnergyBalancePanel );
export default EnergyBalancePanel;
