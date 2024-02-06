import { useState, useEffect, useContext } from 'react';
import { createContainer } from 'unstated-next';
import SettingContext from '../settings';
import { RidePageContext } from '../newRideContext';

const usePrice = () => {
  const [showPrice, setShowPrice] = useState(false);

  const { showSettingsPrice, loadSettingsShowPrice } = SettingContext.useContainer();
  const { businessAccountId } = useContext(RidePageContext);


  useEffect(() => {
    loadSettingsShowPrice();
  }, [businessAccountId]);

  const loadShowPrice = async () => {
    let hidePrice = false;
    console.log("PriceContext::businessAccountId: " , businessAccountId);
    if (businessAccountId) {
      console.log("PriceContext::Loading BA prefs");
      hidePrice = true; // TODO change this to await get prop from BA in DB
    } else {
      console.log("PriceContext:: showSettingsPrice:  laoded from other settings context: " , showSettingsPrice);
      hidePrice = !showSettingsPrice;
    }
    setShowPrice(!hidePrice);
  };

  return {
    loadShowPrice,
    showPrice,
  };
};

export default createContainer(usePrice);
