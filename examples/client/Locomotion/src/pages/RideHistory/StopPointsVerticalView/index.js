import React from 'react';
import moment from 'moment';
import i18n from '../../../I18n';
import VerticalTimeLineCard from './VerticalTimeLine';
import { ContentSubTitle, ContentTitle, PanelContentContainer } from './styled';
import getOrdinal from '../getOrdinal';

const getEtaText = eta => moment(eta).format('HH:mm');

const MAX_DESC_LIMIT = 50;

const Index = ({ ride: { stopPoints } }) => {
  if (stopPoints
    && stopPoints.length) {
    return (
      <PanelContentContainer>
        {stopPoints.map((sp, index) => (
          <VerticalTimeLineCard
            key={`VerticalTimeLineCard#${sp.id}`}
            sp={sp}
            first={index === 0}
            last={index + 1 === stopPoints.length}
            content={(
              <>
                <ContentTitle>
                  {`${sp.ordinalDesc !== 0 ? `${getOrdinal(sp.ordinalDesc + 1)} ` : ''}${i18n.t(`stopPointsTypes.${sp.type}`)}`}
                </ContentTitle>
                <ContentSubTitle>
                  {(sp.description || '').slice(0, MAX_DESC_LIMIT)}
                </ContentSubTitle>
              </>
            )}
            underContent={(
              <ContentTitle>
                {getEtaText(sp.completedAt || sp.arrivedAt)}
              </ContentTitle>
            )}
          />
        ))}
      </PanelContentContainer>
    );
  }
  return null;
};

export default Index;
