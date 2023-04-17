// Copyright 2021-2022, University of Colorado Boulder

/**
 * SunEnergySource is used to produce energy at a constant rate.  The amount of energy produced is based on what the
 * real sun would be delivering to the Earth for the provided surface area.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import myGreenhouseEffect from '../../myGreenhouseEffect.js';
import MyGreenhouseEffectConstants from '../MyGreenhouseEffectConstants.js';
import MyGreenhouseEffectQueryParameters from '../MyGreenhouseEffectQueryParameters.js';
import EMEnergyPacket from './EMEnergyPacket.js';
import EnergyDirection from './EnergyDirection.js';
import EnergyRateTracker from './EnergyRateTracker.js';
import LayersModel from './LayersModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';

// constants
const OUTPUT_PROPORTION_RANGE = new Range( 0.5, 2 );

// Energy produced the sun in Watts per square meter.  This value was calculated using the Stefan-Boltzmann equation,
// for more on the derivation see https://en.wikipedia.org/wiki/Stefan%E2%80%93Boltzmann_law, particularly the section
// entitled "Effective temperature of the Earth".
const OUTPUT_ENERGY_RATE = 343.6;

class SunEnergySource extends PhetioObject {

  // controls whether the sun is shining
  public readonly isShiningProperty: BooleanProperty;
  public readonly outputEnergyRateTracker: EnergyRateTracker;

  // value that controls the output level relative to Earth's sun
  public readonly proportionateOutputRateProperty: NumberProperty;
  private readonly surfaceAreaOfIncidentLight: number;
  private readonly emEnergyPackets: EMEnergyPacket[];

  /**
   * @param surfaceAreaOfIncidentLight - surface area onto which the sun is shining
   * @param emEnergyPackets - array of energy packets into which energy from this source will be placed
   * @param tandem - for phet-io
   */
  public constructor( surfaceAreaOfIncidentLight: number, emEnergyPackets: EMEnergyPacket[], tandem: Tandem ) {

    super( {
      tandem: tandem,
      phetioType: SunEnergySource.SunEnergySourceIO
    } );

    this.isShiningProperty = new BooleanProperty( MyGreenhouseEffectQueryParameters.initiallyStarted, {
      tandem: tandem.createTandem( 'isShiningProperty' )
    } );

    this.proportionateOutputRateProperty = new NumberProperty( 1, {
      range: OUTPUT_PROPORTION_RANGE,
      tandem: tandem.createTandem( 'proportionateOutputRateProperty' )
    } );

    // tracks the average energy output
    this.outputEnergyRateTracker = new EnergyRateTracker( {
      tandem: tandem.createTandem( 'outputEnergyRateTracker' )
    } );

    this.surfaceAreaOfIncidentLight = surfaceAreaOfIncidentLight;

    // {EMEnergyPacket[]} - EM energy packet group where produced energy will be put.
    this.emEnergyPackets = emEnergyPackets;
  }

  /**
   * Produce an energy packet that represents the sun shining towards the earth for the specified amount of time and
   * ass it to the group of energy packets.
   */
  public produceEnergy( dt: number ): void {
    if ( this.isShiningProperty.value ) {
      const energyToProduce = OUTPUT_ENERGY_RATE * this.surfaceAreaOfIncidentLight *
                              this.proportionateOutputRateProperty.value * dt;
      this.outputEnergyRateTracker.addEnergyInfo( energyToProduce, dt );
      this.emEnergyPackets.push( new EMEnergyPacket(
        MyGreenhouseEffectConstants.VISIBLE_WAVELENGTH,
        energyToProduce,
        LayersModel.HEIGHT_OF_ATMOSPHERE,
        EnergyDirection.DOWN
      ) );
    }
  }

  /**
   * Get the current output energy in watts per square meter.
   */
  public getOutputEnergyRate(): number {
    return this.isShiningProperty.value ? OUTPUT_ENERGY_RATE * this.proportionateOutputRateProperty.value : 0;
  }

  /**
   */
  public reset(): void {
    this.outputEnergyRateTracker.reset();
    this.isShiningProperty.reset();
    this.proportionateOutputRateProperty.reset();
  }

  /**
   * SunEnergySourceIO handles PhET-iO serialization of the SunEnergySource. Because serialization involves accessing
   * private members, it delegates to SunEnergySource. The methods that SunEnergySourceIO overrides are typical of
   * 'Dynamic element serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly SunEnergySourceIO = new IOType( 'SunEnergySourceIO', {
    valueType: SunEnergySource,
    stateSchema: {
      outputEnergyRateTracker: EnergyRateTracker.EnergyRateTrackerIO
    }
  } );

  // static values
  public static readonly OUTPUT_ENERGY_RATE = OUTPUT_ENERGY_RATE;
  public static readonly OUTPUT_PROPORTION_RANGE = OUTPUT_PROPORTION_RANGE;
}

myGreenhouseEffect.register( 'SunEnergySource', SunEnergySource );
export default SunEnergySource;