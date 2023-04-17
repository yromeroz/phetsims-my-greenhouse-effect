// Copyright 2021-2022, University of Colorado Boulder

/**
 * Utility functions and other helpful things used in Greenhouse Effect.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import myGreenhouseEffect from '../myGreenhouseEffect.js';

const MyGreenhouseEffectUtils = {

  /**
   * Converts a temperature in Kelvin to degrees Fahrenheit.
   */
  kelvinToFahrenheit( kelvin: number ): number {
    return MyGreenhouseEffectUtils.kelvinToCelsius( kelvin ) * 9 / 5 + 32;
  },

  /**
   * Converts a temperature in Kelvin to degrees Celsius.
   */
  kelvinToCelsius( kelvin: number ): number {
    return kelvin - 273.15;
  }
};

myGreenhouseEffect.register( 'MyGreenhouseEffectUtils', MyGreenhouseEffectUtils );
export default MyGreenhouseEffectUtils;
