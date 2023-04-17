// Copyright 2021-2023, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import GreenhouseEffectIconFactory from '../common/view/GreenhouseEffectIconFactory.js';
import GreenhouseEffectKeyboardHelpContent from '../common/view/GreenhouseEffectKeyboardHelpContent.js';
import myGreenhouseEffect from '../myGreenhouseEffect.js';
import MyGreenhouseEffectStrings from '../MyGreenhouseEffectStrings.js';
import LayerModelModel from './model/LayerModelModel.js';
import LayerModelScreenView from './view/LayerModelScreenView.js';
import MyGreenhouseEffectColors from '../common/MyGreenhouseEffectColors.js';
import MyGreenhouseEffectConstants from '../common/MyGreenhouseEffectConstants.js';

class LayerModelScreen extends Screen<LayerModelModel, LayerModelScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      backgroundColorProperty: MyGreenhouseEffectColors.screenBackgroundColorProperty,
      homeScreenIcon: GreenhouseEffectIconFactory.createLayerModelHomeScreenIcon(),
      maxDT: MyGreenhouseEffectConstants.MAX_DT,
      tandem: tandem,
      name: MyGreenhouseEffectStrings.screen.layerModelStringProperty,
      createKeyboardHelpNode: () => new GreenhouseEffectKeyboardHelpContent( { includeFluxMeterHelp: true } )
    };

    super(
      () => new LayerModelModel( tandem.createTandem( 'model' ) ),
      model => new LayerModelScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

myGreenhouseEffect.register( 'LayerModelScreen', LayerModelScreen );
export default LayerModelScreen;