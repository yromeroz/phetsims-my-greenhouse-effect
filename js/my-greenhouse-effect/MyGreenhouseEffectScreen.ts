// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Yidier Romero
 */

import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import MyGreenhouseEffectColors from '../common/MyGreenhouseEffectColors.js';
import myGreenhouseEffect from '../myGreenhouseEffect.js';
import MyGreenhouseEffectModel from './model/MyGreenhouseEffectModel.js';
import MyGreenhouseEffectScreenView from './view/MyGreenhouseEffectScreenView.js';
import MyGreenhouseEffectStrings from '../MyGreenhouseEffectStrings.js';
import GreenhouseEffectIconFactory from '../common/view/GreenhouseEffectIconFactory.js';
import MyGreenhouseEffectConstants from '../common/MyGreenhouseEffectConstants.js';
import GreenhouseEffectKeyboardHelpContent from '../common/view/GreenhouseEffectKeyboardHelpContent.js';


class MyGreenhouseEffectScreen extends Screen<MyGreenhouseEffectModel, MyGreenhouseEffectScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: MyGreenhouseEffectStrings.screen.myGreenhouseEffectStringProperty,
      homeScreenIcon: GreenhouseEffectIconFactory.createPhotonsHomeScreenIcon(),
      maxDT: MyGreenhouseEffectConstants.MAX_DT,
      tandem: tandem,
      backgroundColorProperty: MyGreenhouseEffectColors.screenBackgroundColorProperty,
      createKeyboardHelpNode: () => new GreenhouseEffectKeyboardHelpContent( { includeFluxMeterHelp: true } )
    };

    super(
      () => new MyGreenhouseEffectModel( tandem.createTandem( 'model' ) ),
      model => new MyGreenhouseEffectScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

myGreenhouseEffect.register( 'MyGreenhouseEffectScreen', MyGreenhouseEffectScreen );
export default MyGreenhouseEffectScreen;