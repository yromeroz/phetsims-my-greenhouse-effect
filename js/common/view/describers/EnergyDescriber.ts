// Copyright 2022, University of Colorado Boulder

/**
 * A describer that is responsible for generating description strings related to energy in
 * this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import myGreenhouseEffect from '../../../myGreenhouseEffect.js';
import MyGreenhouseEffectStrings from '../../../MyGreenhouseEffectStrings.js';

const increasesStringProperty = MyGreenhouseEffectStrings.a11y.increasesStringProperty;
const decreasesStringProperty = MyGreenhouseEffectStrings.a11y.decreasesStringProperty;
const inflowToEarthStringProperty = MyGreenhouseEffectStrings.a11y.inflowToEarthStringProperty;
const outflowToSpaceStringProperty = MyGreenhouseEffectStrings.a11y.outflowToSpaceStringProperty;
const outgoingEnergyPatternStringProperty = MyGreenhouseEffectStrings.a11y.outgoingEnergyPatternStringProperty;
const greaterThanStringProperty = MyGreenhouseEffectStrings.a11y.greaterThanStringProperty;
const lessThanStringProperty = MyGreenhouseEffectStrings.a11y.lessThanStringProperty;
const outgoingEnergyAtAtmospherePatternStringProperty = MyGreenhouseEffectStrings.a11y.outgoingEnergyAtAtmospherePatternStringProperty;
const outgoingEnergyAtAtmosphereEqualStringProperty = MyGreenhouseEffectStrings.a11y.outgoingEnergyAtAtmosphereEqualStringProperty;

class EnergyDescriber {

  /**
   * Returns a string that describes the change in outgoing energy in the system. Will return something like
   *   "Outgoing energy decreases; net energy outflow to space." or
   *   "Outgoing energy increases; net energy inflow to earth."
   *
   * @param outgoingEnergy - Amount of energy leaving the system (going out to space)
   * @param previousOutgoingEnergy - Amount of outgoing energy the last time change was described.
   * @param netEnergy - Net energy for the system.
   */
  public static getOutgoingEnergyChangeDescription( outgoingEnergy: number,
                                                    previousOutgoingEnergy: number,
                                                    netEnergy: number ): string | null {
    let descriptionString = null;

    if ( outgoingEnergy !== previousOutgoingEnergy && netEnergy !== 0 ) {
      const outgoingEnergyChangeString = outgoingEnergy > previousOutgoingEnergy ?
                                         increasesStringProperty.value :
                                         decreasesStringProperty.value;
      const flowChangeString = netEnergy > 0 ?
                               inflowToEarthStringProperty.value :
                               outflowToSpaceStringProperty.value;

      descriptionString = StringUtils.fillIn( outgoingEnergyPatternStringProperty, {
        increasesOrDecreases: outgoingEnergyChangeString,
        inflowOrOutflow: flowChangeString
      } );
    }

    return descriptionString;
  }

  /**
   * Get a description of the energy flow at the top of the atmosphere. Will return something like
   * "Outgoing energy is less than incoming energy at top of atmosphere, net energy inflow to Earth." OR
   * "Outgoing energy is equal to incoming energy at top of atmosphere."
   */
  public static getNetEnergyAtAtmosphereDescription( netInflowOfEnergy: number, inRadiativeBalance: boolean ): string | null {
    let descriptionString;
    if ( inRadiativeBalance ) {

      // The model may be in radiative balance but net energy is not quite zero. In this case it is small enough that
      // it is effectively zero.
      descriptionString = outgoingEnergyAtAtmosphereEqualStringProperty.value;
    }
    else {
      const changeString = netInflowOfEnergy > 0 ?
                           lessThanStringProperty.value :
                           greaterThanStringProperty.value;
      const flowString = netInflowOfEnergy > 0 ?
                         inflowToEarthStringProperty.value :
                         outflowToSpaceStringProperty.value;

      descriptionString = StringUtils.fillIn( outgoingEnergyAtAtmospherePatternStringProperty, {
        greaterThanOrLessThan: changeString,
        inflowOrOutflow: flowString
      } );
    }

    return descriptionString;
  }
}

myGreenhouseEffect.register( 'EnergyDescriber', EnergyDescriber );
export default EnergyDescriber;
