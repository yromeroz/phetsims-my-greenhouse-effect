// Copyright 2021-2023, University of Colorado Boulder

/**
 * ThermometerAndReadout is a Scenery Node that depicts a thermometer and a numerical readout that indicates the
 * temperature.  Based on configuration options, the readout can either be a combo box from which the user can select
 * different units (e.g. Fahrenheit or Celsius), or a simple readout that just shows the temperature.  Options can be
 * used to adjust the size and appearance.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import optionize from '../../../../phet-core/js/optionize.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import ThermometerNode, { ThermometerNodeOptions } from '../../../../scenery-phet/js/ThermometerNode.js';
import { Color, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import myGreenhouseEffect from '../../myGreenhouseEffect.js';
import MyGreenhouseEffectStrings from '../../MyGreenhouseEffectStrings.js';
import MyGreenhouseEffectConstants from '../MyGreenhouseEffectConstants.js';
import MyGreenhouseEffectQueryParameters from '../MyGreenhouseEffectQueryParameters.js';
import MyGreenhouseEffectUtils from '../MyGreenhouseEffectUtils.js';
import GroundLayer from '../model/GroundLayer.js';
import LayersModel from '../model/LayersModel.js';
import TemperatureUnits from '../model/TemperatureUnits.js';
import TemperatureDescriber from './describers/TemperatureDescriber.js';
import GreenhouseEffectObservationWindow from './GreenhouseEffectObservationWindow.js';

// constants
const THERMOMETER_TO_READOUT_DISTANCE = 15; // in screen coordinates
const DECIMAL_PLACES_IN_READOUT = MyGreenhouseEffectQueryParameters.showAdditionalTemperatureDigits ? 3 : 1;
const kelvinUnitsStringProperty = MyGreenhouseEffectStrings.temperature.units.kelvinStringProperty;
const celsiusUnitsStringProperty = MyGreenhouseEffectStrings.temperature.units.celsiusStringProperty;
const fahrenheitUnitsStringProperty = MyGreenhouseEffectStrings.temperature.units.fahrenheitStringProperty;

class ReadoutType extends EnumerationValue {
  public static readonly SELECTABLE = new ReadoutType();
  public static readonly FIXED = new ReadoutType();

  public static readonly enumeration = new Enumeration( ReadoutType );
}

type SelfOptions = {
  minTemperature?: number;
  maxTemperature?: number;
  readoutType?: ReadoutType;
  listParentNode?: Node | null;
  thermometerNodeOptions?: ThermometerNodeOptions;
  tandem?: Tandem;
};

type ThermometerAndReadoutOptions = SelfOptions & NodeOptions;

class ThermometerAndReadout extends Node {

  /**
   * @param model
   * @param [providedOptions]
   */
  public constructor( model: LayersModel, providedOptions?: ThermometerAndReadoutOptions ) {

    const options = optionize<ThermometerAndReadoutOptions, SelfOptions, NodeOptions>()( {

      minTemperature: GroundLayer.MINIMUM_EARTH_AT_NIGHT_TEMPERATURE,
      maxTemperature: GreenhouseEffectObservationWindow.EXPECTED_MAX_TEMPERATURE + 3,

      // readout type that will be shown below the thermometer, either SELECTABLE (i.e. a combo box) or fixed
      readoutType: ReadoutType.SELECTABLE,

      // parent node used for the combo box list, only used for SELECTABLE readout
      listParentNode: null,

      // options passed along to the ThermometerNode
      thermometerNodeOptions: {
        bulbDiameter: 40,
        tubeHeight: 150,
        tubeWidth: 20,
        backgroundFill: 'white'
      },

      // phet-io
      tandem: Tandem.REQUIRED
    }, providedOptions );

    // options passed to the supertype later in mutate
    super();

    // visibility
    model.surfaceThermometerVisibleProperty.linkAttribute( this, 'visible' );

    // thermometer - range chosen empirically to make it look reasonable in the sim
    const thermometerNode = new ThermometerNode( model.surfaceTemperatureKelvinProperty, options.minTemperature, options.maxTemperature, options.thermometerNodeOptions );
    this.addChild( thermometerNode );

    // ranges for each temperature Property, so the NumberDisplay can determine space needed for each readout
    const kelvinRange = model.surfaceTemperatureKelvinProperty.range;
    const celsiusRange = new Range(
      MyGreenhouseEffectUtils.kelvinToCelsius( kelvinRange.min ),
      MyGreenhouseEffectUtils.kelvinToCelsius( kelvinRange.max )
    );
    const fahrenheitRange = new Range(
      MyGreenhouseEffectUtils.kelvinToFahrenheit( kelvinRange.min ),
      MyGreenhouseEffectUtils.kelvinToFahrenheit( kelvinRange.max )
    );

    if ( options.readoutType === ReadoutType.SELECTABLE ) {

      const comboBoxItems = [
        ThermometerAndReadout.createComboBoxItem(
          kelvinUnitsStringProperty,
          model.surfaceTemperatureKelvinProperty,
          model.surfaceTemperatureKelvinProperty.range,
          TemperatureUnits.KELVIN,
          `kelvin${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
        ),
        ThermometerAndReadout.createComboBoxItem(
          celsiusUnitsStringProperty,
          model.surfaceTemperatureCelsiusProperty,
          celsiusRange,
          TemperatureUnits.CELSIUS,
          `celsius${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
        ),
        ThermometerAndReadout.createComboBoxItem(
          fahrenheitUnitsStringProperty,
          model.surfaceTemperatureFahrenheitProperty,
          fahrenheitRange,
          TemperatureUnits.FAHRENHEIT,
          `fahrenheit${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
        )
      ];

      const comboBox = new ComboBox( model.temperatureUnitsProperty, comboBoxItems, options.listParentNode || this, {
        align: 'right',
        listPosition: 'above',
        yMargin: 4,
        xMargin: 4,
        centerTop: thermometerNode.centerBottom.plusXY( 0, THERMOMETER_TO_READOUT_DISTANCE ),

        // pdom
        helpText: MyGreenhouseEffectStrings.a11y.temperatureUnitsHelpTextStringProperty,
        accessibleName: MyGreenhouseEffectStrings.a11y.temperatureUnitsLabelStringProperty,

        // phet-io
        tandem: options.tandem.createTandem( 'comboBox' )
      } );
      this.addChild( comboBox );

      // Make sure the NumberDisplays are all the same width.  This has to be done after the ComboBox is constructed
      // because the ComboBox creates these nodes using a passed-in creator function.  See
      // https://github.com/phetsims/greenhouse-effect/issues/256.
      const maxItemWidth = Math.max( ..._.map( comboBox.nodes, 'width' ) );
      comboBox.nodes.forEach( ( node: Node ) => {
        if ( node instanceof NumberDisplay ) {
          node.setBackgroundWidth( maxItemWidth );
        }
      } );
    }
    else {

      // Create a derived property for the value that will be displayed as the temperature.
      const temperatureValueProperty = new DerivedProperty(
        [ model.surfaceTemperatureKelvinProperty, model.temperatureUnitsProperty ],
        ( temperature, temperatureUnits ) =>
          temperatureUnits === TemperatureUnits.KELVIN ? temperature :
          temperatureUnits === TemperatureUnits.CELSIUS ? MyGreenhouseEffectUtils.kelvinToCelsius( temperature ) :
          MyGreenhouseEffectUtils.kelvinToFahrenheit( temperature )
      );

      const unitsStringProperty = new DerivedProperty(
        [
          model.temperatureUnitsProperty,
          MyGreenhouseEffectStrings.temperature.units.kelvinStringProperty,
          MyGreenhouseEffectStrings.temperature.units.celsiusStringProperty,
          MyGreenhouseEffectStrings.temperature.units.fahrenheitStringProperty
        ],
        ( units, kelvinUnitsString, celsiusUnitsString, fahrenheitUnitsString ) => {
          return units === TemperatureUnits.KELVIN ? kelvinUnitsString :
                 units === TemperatureUnits.CELSIUS ? celsiusUnitsString :
                 fahrenheitUnitsString;
        }
      );

      // Create the temperature readout.
      const temperatureReadout = new NumberDisplay( temperatureValueProperty, new Range( 0, 999 ), {
        centerTop: thermometerNode.centerBottom.plusXY( 0, THERMOMETER_TO_READOUT_DISTANCE ),
        backgroundStroke: Color.BLACK,
        decimalPlaces: DECIMAL_PLACES_IN_READOUT,
        noValueAlign: 'center',
        cornerRadius: 3,
        xMargin: 12,
        yMargin: 3,
        textOptions: {
          font: MyGreenhouseEffectConstants.CONTENT_FONT,
          maxWidth: 100
        },
        valuePattern: new PatternStringProperty(
          MyGreenhouseEffectStrings.temperature.units.valueUnitsPatternStringProperty,
          { units: unitsStringProperty }
        )
      } );
      this.addChild( temperatureReadout );
    }

    // mutate with layout options after the Node has been assembled
    this.mutate( options );
  }

  /**
   * Create a ComboBox item for the units combo box. The Node for the ComboBox item is a NumberDisplay showing the
   * current value of temperature in those units.
   */
  private static createComboBoxItem( unitsStringProperty: TReadOnlyProperty<string>,
                                     property: TReadOnlyProperty<number>,
                                     propertyRange: Range,
                                     propertyValue: TemperatureUnits,
                                     tandemName: string ): ComboBoxItem<TemperatureUnits> {

    const numberDisplayOptions = {
      backgroundStroke: null,
      decimalPlaces: DECIMAL_PLACES_IN_READOUT,
      textOptions: {
        font: MyGreenhouseEffectConstants.CONTENT_FONT,
        maxWidth: 120
      },
      valuePattern: new PatternStringProperty(
        MyGreenhouseEffectStrings.temperature.units.valueUnitsPatternStringProperty, {
          units: unitsStringProperty
        } )
    };

    return {
      value: propertyValue,
      createNode: () => new NumberDisplay( property, propertyRange, numberDisplayOptions ),
      tandemName: tandemName,
      a11yName: TemperatureDescriber.getTemperatureUnitsString( propertyValue )
    };
  }

  // static values
  public static ReadoutType = ReadoutType;
}

myGreenhouseEffect.register( 'ThermometerAndReadout', ThermometerAndReadout );

export default ThermometerAndReadout;
