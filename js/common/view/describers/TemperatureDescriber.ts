// Copyright 2021-2022, University of Colorado Boulder

/**
 * Responsible for generating description strings that describe the temperature.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../../dot/js/Range.js';
import Utils from '../../../../../dot/js/Utils.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import myGreenhouseEffect from '../../../myGreenhouseEffect.js';
import MyGreenhouseEffectStrings from '../../../MyGreenhouseEffectStrings.js';
import MyGreenhouseEffectUtils from '../../MyGreenhouseEffectUtils.js';
import { ConcentrationControlMode, ConcentrationDate } from '../../model/ConcentrationModel.js';
import TemperatureUnits from '../../model/TemperatureUnits.js';

// strings used to describe temperature
const extremelyHighStringProperty = MyGreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.extremelyHighStringProperty;
const veryHighStringProperty = MyGreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.veryHighStringProperty;
const highStringProperty = MyGreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.highStringProperty;
const moderateStringProperty = MyGreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.moderateStringProperty;
const lowStringProperty = MyGreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.lowStringProperty;
const veryLowStringProperty = MyGreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.veryLowStringProperty;
const extremelyLowStringProperty = MyGreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.extremelyLowStringProperty;
const historicallyLowStringProperty = MyGreenhouseEffectStrings.a11y.historicalRelativeDescriptions.lowStringProperty;
const historicallyModerateStringProperty = MyGreenhouseEffectStrings.a11y.historicalRelativeDescriptions.moderateStringProperty;
const historicallyHighStringProperty = MyGreenhouseEffectStrings.a11y.historicalRelativeDescriptions.highStringProperty;
const surfaceTemperatureChangeWithValuePatternStringProperty = MyGreenhouseEffectStrings.a11y.surfaceTemperatureChangeWithValuePatternStringProperty;
const surfaceTemperatureChangeWithoutValuePatternStringProperty = MyGreenhouseEffectStrings.a11y.surfaceTemperatureChangeWithoutValuePatternStringProperty;
const temperatureChangeWithValuePatternStringProperty = MyGreenhouseEffectStrings.a11y.temperatureChangeWithValuePatternStringProperty;
const temperatureChangeWithoutValuePatternStringProperty = MyGreenhouseEffectStrings.a11y.temperatureChangeWithoutValuePatternStringProperty;
const surfaceTemperatureStableStringProperty = MyGreenhouseEffectStrings.a11y.surfaceTemperatureStableStringProperty;
const surfaceTemperatureStableWithDescriptionStringProperty = MyGreenhouseEffectStrings.a11y.surfaceTemperatureStableWithDescriptionStringProperty;
const surfaceTemperatureStableWithValueStringProperty = MyGreenhouseEffectStrings.a11y.surfaceTemperatureStableWithValueStringProperty;
const surfaceTemperatureStableWithDescriptionAndValueStringProperty = MyGreenhouseEffectStrings.a11y.surfaceTemperatureStableWithDescriptionAndValueStringProperty;
const warmingStringProperty = MyGreenhouseEffectStrings.a11y.warmingStringProperty;
const coolingStringProperty = MyGreenhouseEffectStrings.a11y.coolingStringProperty;
const stabilizingStringProperty = MyGreenhouseEffectStrings.a11y.stabilizingStringProperty;
const surfaceTemperatureIsQuantitativeAndQualitativePatternStringProperty = MyGreenhouseEffectStrings.a11y.surfaceTemperatureIsQuantitativeAndQualitativePatternStringProperty;
const surfaceTemperatureIsQuantitativePatternStringProperty = MyGreenhouseEffectStrings.a11y.surfaceTemperatureIsQuantitativePatternStringProperty;
const surfaceTemperatureIsQualitativePatternStringProperty = MyGreenhouseEffectStrings.a11y.surfaceTemperatureIsQualitativePatternStringProperty;

const qualitativeTemperatureDescriptionStrings = [
  extremelyLowStringProperty.value,
  veryLowStringProperty.value,
  lowStringProperty.value,
  moderateStringProperty.value,
  highStringProperty.value,
  veryHighStringProperty.value,
  extremelyHighStringProperty.value
];

// The minimum values for temperatures in kelvin each description used in the above array when describing the
// temperature qualitatively.
const qualitativeTemperatureDescriptionThresholds = [
  260, 275, 283, 288, 293, 301
];

assert && assert( qualitativeTemperatureDescriptionThresholds.length + 1 === qualitativeTemperatureDescriptionStrings.length,
  'thresholds for finding the description needs to match the length of descriptions to find the qualitative temperature description' );

// Range used for categorizing temperature values into historical descriptions.  This was empirically determined based
// on the emergent behavior of the model, so it may need updating if the model changes.
const historicallyModerateTemperatureRange = new Range( 286, 287.8 );

// written units of temperature
const kelvinStringProperty = MyGreenhouseEffectStrings.a11y.temperatureUnits.kelvinStringProperty;
const celsiusStringProperty = MyGreenhouseEffectStrings.a11y.temperatureUnits.celsiusStringProperty;
const fahrenheitStringProperty = MyGreenhouseEffectStrings.a11y.temperatureUnits.fahrenheitStringProperty;

class TemperatureDescriber {

  /**
   * Get formatted description for the current temperature in the provided units, for use in other contexts. Will
   * return something like:
   * "245 Kelvin" or "12 Celsius"
   *
   * @param temperatureKelvin - temperature, in kelvin
   * @param unitsValue
   */
  public static getQuantitativeTemperatureDescription( temperatureKelvin: number, unitsValue: TemperatureUnits ): string {
    return StringUtils.fillIn( MyGreenhouseEffectStrings.temperature.units.valueUnitsPatternStringProperty, {
      value: TemperatureDescriber.getTemperatureValueString( temperatureKelvin, unitsValue ),
      units: TemperatureDescriber.getTemperatureUnitsString( unitsValue )
    } );
  }

  /**
   * Returns a qualitative description of the temperature of the ground surface. Will return something like "very high"
   * or "moderate" or "historically high"
   *
   * @param value - the temperature in kelvin
   * @param concentrationControlMode - the mode for how concentration is controlled, either by value or by date
   * @param date - the selected date
   */
  public static getQualitativeTemperatureDescriptionString( value: number,
                                                            concentrationControlMode: ConcentrationControlMode,
                                                            date: ConcentrationDate ): string {

    let qualitativeDescriptionString;

    if ( concentrationControlMode === ConcentrationControlMode.BY_VALUE ) {
      qualitativeDescriptionString = qualitativeTemperatureDescriptionStrings[ 0 ];

      // Use the minimum values in the "thresholds" array to find the correct qualitative description
      for ( let i = 0; i < qualitativeTemperatureDescriptionThresholds.length; i++ ) {
        const thresholdMin = qualitativeTemperatureDescriptionThresholds[ i ];
        if ( value >= thresholdMin ) {
          qualitativeDescriptionString = qualitativeTemperatureDescriptionStrings[ i + 1 ];
        }
      }
    }
    else {

      // Get a historical description.
      assert && assert( concentrationControlMode === ConcentrationControlMode.BY_DATE );
      if ( value < historicallyModerateTemperatureRange.min ) {
        qualitativeDescriptionString = historicallyLowStringProperty.value;
      }
      else if ( value > historicallyModerateTemperatureRange.max ) {
        qualitativeDescriptionString = historicallyHighStringProperty.value;
      }
      else {
        qualitativeDescriptionString = historicallyModerateStringProperty.value;
      }
    }

    return qualitativeDescriptionString;
  }

  /**
   * Get a qualitative description of the surface temperature as a full sentence. Returns something like
   * "Surface temperature is somewhat high."
   */
  public static getQualitativeSurfaceTemperatureDescriptionString( temperatureKelvin: number,
                                                                   concentrationControlMode: ConcentrationControlMode,
                                                                   date: ConcentrationDate ): string {
    return StringUtils.fillIn( MyGreenhouseEffectStrings.a11y.qualitativeSurfaceTemperaturePatternStringProperty, {
      description: TemperatureDescriber.getQualitativeTemperatureDescriptionString( temperatureKelvin, concentrationControlMode, date )
    } );
  }

  /**
   * Get the current temperature in the provided units, formatted for use in interactive description.
   */
  public static getTemperatureValueString( temperatureKelvin: number, unitsValue: TemperatureUnits ): string {
    const convertedValue = unitsValue === TemperatureUnits.KELVIN ? temperatureKelvin :
                           unitsValue === TemperatureUnits.CELSIUS ? MyGreenhouseEffectUtils.kelvinToCelsius( temperatureKelvin ) :
                           MyGreenhouseEffectUtils.kelvinToFahrenheit( temperatureKelvin );

    return Utils.toFixed( convertedValue, 1 );
  }

  /**
   * From the EnumerationProperty value, return the string for the units of temperature for use in interactive
   * descriptions. Will return something like
   * "Kelvin" or
   * "degrees Celsius"
   */
  public static getTemperatureUnitsString( unitsValue: TemperatureUnits ): string {
    return unitsValue === TemperatureUnits.KELVIN ? kelvinStringProperty.value :
           unitsValue === TemperatureUnits.CELSIUS ? celsiusStringProperty.value :
           fahrenheitStringProperty.value;
  }

  /**
   * Get a description of the change in surface temperature, with more or less information depending on whether
   * the thermometer is visible. Will return something like:
   *
   * "Surface temperature warming, now 277 Kelvin." or
   * "Cooling, now 266.1 Kelvin." or
   * "Surface temperature stabilizing, now 255 Kelvin."
   *
   * @param oldTemperature
   * @param currentTemperature
   * @param thermometerVisible - Are we displaying surface temperature values?
   * @param unitsValue - What are the displayed units?
   * @param includeSurfaceTemperatureFragment - Include the "Surface temperature..." prefix fragment?
   * @param describeAsStabilizing - Instead of 'warming' or 'cooling', describe the temperature as 'stabilizing'.
   */
  public static getSurfaceTemperatureChangeString( oldTemperature: number,
                                                   currentTemperature: number,
                                                   thermometerVisible: boolean,
                                                   unitsValue: TemperatureUnits,
                                                   includeSurfaceTemperatureFragment: boolean,
                                                   describeAsStabilizing: boolean ): string | null {
    let changeString = null;
    let patternString = null;

    if ( oldTemperature !== currentTemperature ) {
      let qualitativeDescriptionString = describeAsStabilizing ?
                                         stabilizingStringProperty.value :
                                         ( currentTemperature > oldTemperature ?
                                           warmingStringProperty.value :
                                           coolingStringProperty.value );

      // If we are not including the surface temperature fragment, the qualitative description is the first word.
      // This is NOT i18n friendly, but PhET's policy is that is OK for now.
      if ( !includeSurfaceTemperatureFragment ) {
        qualitativeDescriptionString = StringUtils.capitalize( qualitativeDescriptionString );
      }

      if ( thermometerVisible ) {
        const temperatureValueString = TemperatureDescriber.getQuantitativeTemperatureDescription( currentTemperature, unitsValue );

        patternString = includeSurfaceTemperatureFragment ?
                        surfaceTemperatureChangeWithValuePatternStringProperty.value :
                        temperatureChangeWithValuePatternStringProperty.value;
        changeString = StringUtils.fillIn( patternString, {
          qualitativeDescription: qualitativeDescriptionString,
          temperature: temperatureValueString
        } );
      }
      else {

        patternString = includeSurfaceTemperatureFragment ?
                        surfaceTemperatureChangeWithoutValuePatternStringProperty.value :
                        temperatureChangeWithoutValuePatternStringProperty.value;
        changeString = StringUtils.fillIn( patternString, {
          qualitativeDescription: qualitativeDescriptionString
        } );
      }
    }

    return changeString;
  }

  /**
   * Get a description of the surface temperature when it is stable, i.e. the ground is in equilibrium. This will
   * include more or less information depending on whether the thermometer is visible and/or the surface temperature
   * indicator is visible. Will return something like: "Surface temperature stable and hot, now 277 Kelvin."
   *
   * Please note that this does not actually check that the temperature *is* stable, so use wisely.
   */
  public static getSurfaceTemperatureStableString( temperature: number,
                                                   thermometerVisible: boolean,
                                                   surfaceTemperatureIndicationVisible: boolean,
                                                   unitsValue: TemperatureUnits,
                                                   concentrationControlMode: ConcentrationControlMode,
                                                   date: ConcentrationDate ): string {

    let stableTemperatureString = '';
    if ( thermometerVisible && surfaceTemperatureIndicationVisible ) {
      stableTemperatureString = StringUtils.fillIn( surfaceTemperatureStableWithDescriptionAndValueStringProperty, {
        qualitativeDescription: TemperatureDescriber.getQualitativeTemperatureDescriptionString(
          temperature,
          concentrationControlMode,
          date
        ),
        quantitativeDescription: TemperatureDescriber.getQuantitativeTemperatureDescription( temperature, unitsValue )
      } );
    }
    else if ( thermometerVisible && !surfaceTemperatureIndicationVisible ) {
      stableTemperatureString = StringUtils.fillIn( surfaceTemperatureStableWithValueStringProperty, {
        quantitativeDescription: TemperatureDescriber.getQuantitativeTemperatureDescription( temperature, unitsValue )
      } );
    }
    else if ( !thermometerVisible && surfaceTemperatureIndicationVisible ) {
      stableTemperatureString = StringUtils.fillIn( surfaceTemperatureStableWithDescriptionStringProperty, {
        qualitativeDescription: TemperatureDescriber.getQualitativeTemperatureDescriptionString(
          temperature,
          concentrationControlMode,
          date
        )
      } );
    }
    else if ( !thermometerVisible && !surfaceTemperatureIndicationVisible ) {
      stableTemperatureString = surfaceTemperatureStableStringProperty.value;
    }

    return stableTemperatureString;
  }

  /**
   * Get a description of what the current surface temperature "is". Similar to other functions in this class, but with
   * slightly different grammatical structure for different contexts. If the thermometer and surface temperature
   * indicators are both invisible, null will be returned.
   *
   * Will return something like
   * "The surface temperature is high, 290 Kelvin."
   */
  public static getSurfaceTemperatureIsString( temperature: number,
                                               thermometerVisible: boolean,
                                               surfaceTemperatureIndicationVisible: boolean,
                                               unitsValue: TemperatureUnits,
                                               concentrationControlMode: ConcentrationControlMode,
                                               date: ConcentrationDate ): string | null {

    let surfaceTemperatureDescriptionString = null;
    if ( thermometerVisible && surfaceTemperatureIndicationVisible ) {
      surfaceTemperatureDescriptionString = StringUtils.fillIn(
        surfaceTemperatureIsQuantitativeAndQualitativePatternStringProperty,
        {
          description: TemperatureDescriber.getQualitativeTemperatureDescriptionString(
            temperature,
            concentrationControlMode,
            date
          ),
          value: TemperatureDescriber.getQuantitativeTemperatureDescription( temperature, unitsValue )
        }
      );
    }
    else if ( thermometerVisible ) {
      surfaceTemperatureDescriptionString = StringUtils.fillIn( surfaceTemperatureIsQuantitativePatternStringProperty, {
        value: TemperatureDescriber.getQuantitativeTemperatureDescription( temperature, unitsValue )
      } );
    }
    else if ( surfaceTemperatureIndicationVisible ) {
      surfaceTemperatureDescriptionString = StringUtils.fillIn( surfaceTemperatureIsQualitativePatternStringProperty, {
        description: TemperatureDescriber.getQualitativeTemperatureDescriptionString(
          temperature,
          concentrationControlMode,
          date
        )
      } );
    }

    return surfaceTemperatureDescriptionString;
  }
}

myGreenhouseEffect.register( 'TemperatureDescriber', TemperatureDescriber );
export default TemperatureDescriber;
