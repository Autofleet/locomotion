import React, { useEffect } from 'react';
import PageHeader from '../../Components/PageHeader';
import { PageContent } from './styled';
import settingsContext from "../../context/settings";
import {NewCreditForm} from "../../Components/NewCreditForm";

export default ({ navigation}) => {
  const { settingsList, getSettings } = settingsContext.useContainer();

  let getS = async () => {
    console.log(await getSettings())
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('willFocus', () => {
      // getRides();
    });

    console.log({ settingsList })
    getS();


    return unsubscribe;
  }, [navigation]);

  return (
    <PageContent>
      <PageHeader
        displayIcon={false}
        title={'Add credit card'}
      />
      <NewCreditForm
        canSkip
        onDone={() =>
          navigation.navigate('MainApp')
        }
      />
    </PageContent>
  );
};
