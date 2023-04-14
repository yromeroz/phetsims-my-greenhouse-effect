// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Yidier Romero
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import MyGreenhouseEffectColors from '../common/MyGreenhouseEffectColors.js';
import myGreenhouseEffect from '../myGreenhouseEffect.js';
import MyGreenhouseEffectModel from './model/MyGreenhouseEffectModel.js';
import MyGreenhouseEffectScreenView from './view/MyGreenhouseEffectScreenView.js';
import MyGreenhouseEffectStrings from '../MyGreenhouseEffectStrings.js';

type SelfOptions = {
  //TODO add options that are specific to MyGreenhouseEffectScreen here
};

type MyGreenhouseEffectScreenOptions = SelfOptions & ScreenOptions;

export default class MyGreenhouseEffectScreen extends Screen<MyGreenhouseEffectModel, MyGreenhouseEffectScreenView> {

  public constructor( providedOptions: MyGreenhouseEffectScreenOptions ) {

    const options = optionize<MyGreenhouseEffectScreenOptions, SelfOptions, ScreenOptions>()( {
      name: MyGreenhouseEffectStrings.screen.nameStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: MyGreenhouseEffectColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new MyGreenhouseEffectModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new MyGreenhouseEffectScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

myGreenhouseEffect.register( 'MyGreenhouseEffectScreen', MyGreenhouseEffectScreen );