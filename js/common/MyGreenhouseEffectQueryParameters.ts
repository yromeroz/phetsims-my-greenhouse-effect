// Copyright 2023, University of Colorado Boulder

/**
 * Defines query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author Yidier Romero
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import myGreenhouseEffect from '../myGreenhouseEffect.js';

const SCHEMA_MAP = {

  // This threshold value is used to decide when an EnergyAbsorbingEmittingLayer is considered to be in equilibrium,
  // meaning that the amount of incoming energy is close to the amount of outgoing energy.  There is another query
  // parameter that controls the amount of time that this must be true.  This value is in Watts per square meter.  See
  // https://github.com/phetsims/greenhouse-effect/issues/137 for more information.
  // TODO: Prior to initial publication, this query parameter should be removed and the value incorporated directly into the code, see https://github.com/phetsims/greenhouse-effect/issues/137
  atEquilibriumThreshold: { type: 'number', defaultValue: 0.004 },

  // This value is used in conjunction with atEquilibriumThreshold to decide whether an EnergyAbsorbingEmittingLayer is
  // in energy equilibrium.  To be considered to be in equilibrium, the net different between incoming and radiated
  // energy must be less than the threshold for the at-equilibrium time.  This value is in seconds.  See
  // https://github.com/phetsims/greenhouse-effect/issues/137 for more information.
  // TODO: Prior to initial publication, this query parameter should be removed and the value incorporated directly into the code, see https://github.com/phetsims/greenhouse-effect/issues/137
  atEquilibriumTime: { type: 'number', defaultValue: 2.0 },

  // The default temperature units to use, meaning the units that all thermometers will be set to on startup and after a
  // reset.  The valid values represent Kelvin, degrees Celsius, and degrees Fahrenheit.
  defaultTemperatureUnits: {
    type: 'string',
    validValues: [ 'K', 'C', 'F' ],
    defaultValue: 'C'
  },

  // Enables the feature that shows cueing arrows on the flux sensor.  This sets the initial value of
  // GreenhouseEffectOptions.cueingArrowsEnabledProperty.
  cueingArrowsEnabled: {
    type: 'boolean',
    defaultValue: true,
    public: true
  },

  // a flag that starts the launches the sim with the sunlight initially started, for ease of development
  initiallyStarted: { type: 'boolean', defaultValue: false },

  // whether or not to run with customizations for Open Sci Ed
  openSciEd: { type: 'flag' },

  // Show additional digits on the temperature readout.  This can be useful for fine-tuning of albedo and gas
  // concentration values.
  showAdditionalTemperatureDigits: { type: 'flag' },

  // show representations of the energy absorbing/emitting layers on the screens where they are usually not visible
  showAllLayers: { type: 'flag' },

  // show representations of the energy absorbing/emitting layers on the screens where they are usually not visible
  waveGapsEnabled: { type: 'boolean', defaultValue: false }
};

const MyGreenhouseEffectQueryParameters = QueryStringMachine.getAll( SCHEMA_MAP );

// The schema map is a read-only part of the public API, in case schema details (e.g. validValues) are needed elsewhere.
MyGreenhouseEffectQueryParameters.SCHEMA_MAP = SCHEMA_MAP;

myGreenhouseEffect.register( 'MyGreenhouseEffectQueryParameters', MyGreenhouseEffectQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.myGreenhouseEffect.MyGreenhouseEffectQueryParameters' );

export default MyGreenhouseEffectQueryParameters;