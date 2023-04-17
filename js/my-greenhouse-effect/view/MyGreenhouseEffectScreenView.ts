// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Yidier Romero
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import GreenhouseEffectScreenView from '../../common/view/GreenhouseEffectScreenView.js';
import LayerModelObservationWindow from '../../common/view/LayerModelObservationWindow.js';
import LayersModelTimeControlNode from '../../common/view/LayersModelTimeControlNode.js';
import MorePhotonsCheckbox from '../../common/view/MorePhotonsCheckbox.js';
import myGreenhouseEffect from '../../myGreenhouseEffect.js';
import MyGreenhouseEffectModel from '../model/MyGreenhouseEffectModel.js';
import LayersControl from '../../layer-model/view/LayersControl.js';
import SunAndReflectionControl from '../../layer-model/view/SunAndReflectionControl.js';
import TemperatureUnitsSelector from '../../layer-model/view/TemperatureUnitsSelector.js';

class MyGreenhouseEffectScreenView extends GreenhouseEffectScreenView {

  public constructor( model: MyGreenhouseEffectModel, tandem: Tandem ) {

    // Create the observation window that will depict the layers and photons.
    const observationWindow = new LayerModelObservationWindow( model, {
      tandem: tandem.createTandem( 'observationWindow' )
    } );

    const timeControlNode = new LayersModelTimeControlNode( model, {
      tandem: tandem.createTandem( 'timeControlNode' )
    } );

    super( model, observationWindow, timeControlNode, {

      // Frame the observation window so that the photons appear to stay within it.
      useClippingFrame: true,

      // phet-io
      tandem: tandem
    } );

    const temperatureUnitsSelector = new TemperatureUnitsSelector(
      model.temperatureUnitsProperty,
      tandem.createTandem( 'temperatureUnitsSelector' )
    );
    this.addChild( temperatureUnitsSelector );

    const morePhotonsCheckbox = new MorePhotonsCheckbox(
      model.photonCollection.showAllSimulatedPhotonsInViewProperty,
      tandem.createTandem( 'morePhotonsCheckbox' )
    );
    this.addChild( morePhotonsCheckbox );

    // layout
    temperatureUnitsSelector.left = this.observationWindow.left;
    temperatureUnitsSelector.top = this.observationWindow.bottom + 3;
    morePhotonsCheckbox.left = this.observationWindow.left;
    morePhotonsCheckbox.top = temperatureUnitsSelector.bottom + 12;

    // controls on the side
    const sunAndReflectionControl = new SunAndReflectionControl(
      this.energyLegend.width,
      model,
      tandem.createTandem( 'sunAndReflectionControl' )
    );
    this.legendAndControlsVBox.addChild( sunAndReflectionControl );

    const layersControl = new LayersControl(
      this.energyLegend.width,
      model,
      tandem.createTandem( 'layersControl' )
    );
    this.legendAndControlsVBox.addChild( layersControl );

    // pdom - override the pdomOrders for the supertype to insert subtype components
    this.pdomPlayAreaNode.pdomOrder = [
      this.observationWindow,
      sunAndReflectionControl,
      layersControl,
      observationWindow.showThermometerCheckbox,
      ...observationWindow.atmosphereLayerNodes,
      observationWindow.instrumentVisibilityControls,
      observationWindow.fluxMeterNode
    ];
    this.pdomControlAreaNode.pdomOrder = [
      temperatureUnitsSelector,
      morePhotonsCheckbox,
      this.timeControlNode,
      this.resetAllButton
    ];
  }
}

myGreenhouseEffect.register( 'MyGreenhouseEffectScreenView', MyGreenhouseEffectScreenView );
export default MyGreenhouseEffectScreenView;