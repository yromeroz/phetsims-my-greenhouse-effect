// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Yidier Romero
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import MyGreenhouseEffectConstants from '../../common/MyGreenhouseEffectConstants.js';
import myGreenhouseEffect from '../../myGreenhouseEffect.js';
import MyGreenhouseEffectModel from '../model/MyGreenhouseEffectModel.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
 //TODO add options that are specific to MyGreenhouseEffectScreenView here
};

type MyGreenhouseEffectScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class MyGreenhouseEffectScreenView extends ScreenView {

  public constructor( model: MyGreenhouseEffectModel, providedOptions: MyGreenhouseEffectScreenViewOptions ) {

    const options = optionize<MyGreenhouseEffectScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );

    super( options );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - MyGreenhouseEffectConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - MyGreenhouseEffectConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    //TODO
  }
}

myGreenhouseEffect.register( 'MyGreenhouseEffectScreenView', MyGreenhouseEffectScreenView );