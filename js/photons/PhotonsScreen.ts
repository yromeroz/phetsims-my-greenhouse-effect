// Copyright 2021-2023, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import MyGreenhouseEffectColors from '../common/MyGreenhouseEffectColors.js';
import MyGreenhouseEffectConstants from '../common/MyGreenhouseEffectConstants.js';
import GreenhouseEffectIconFactory from '../common/view/GreenhouseEffectIconFactory.js';
import GreenhouseEffectKeyboardHelpContent from '../common/view/GreenhouseEffectKeyboardHelpContent.js';
import myGreenhouseEffect from '../myGreenhouseEffect.js';
import MyGreenhouseEffectStrings from '../MyGreenhouseEffectStrings.js';
import PhotonsModel from './model/PhotonsModel.js';
import PhotonsScreenView from './view/PhotonsScreenView.js';

class PhotonsScreen extends Screen<PhotonsModel, PhotonsScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      backgroundColorProperty: MyGreenhouseEffectColors.screenBackgroundColorProperty,
      homeScreenIcon: GreenhouseEffectIconFactory.createPhotonsHomeScreenIcon(),
      maxDT: MyGreenhouseEffectConstants.MAX_DT,
      tandem: tandem,
      name: MyGreenhouseEffectStrings.screen.photonsStringProperty,
      descriptionContent: MyGreenhouseEffectStrings.a11y.photons.homeScreenDescriptionStringProperty,
      createKeyboardHelpNode: () => new GreenhouseEffectKeyboardHelpContent( { includeFluxMeterHelp: true } )
    };

    super(
      () => new PhotonsModel( tandem.createTandem( 'model' ) ),
      model => new PhotonsScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

myGreenhouseEffect.register( 'PhotonsScreen', PhotonsScreen );
export default PhotonsScreen;