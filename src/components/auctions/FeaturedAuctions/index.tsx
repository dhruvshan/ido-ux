import React from 'react'
import styled from 'styled-components'

import { AuctionInfo } from '../../../hooks/useAllAuctionInfos'
import { InlineLoading } from '../../common/InlineLoading'
import { SpinnerSize } from '../../common/Spinner'
import { InfoIcon } from '../../icons/InfoIcon'
import { EmptyContentText, EmptyContentWrapper } from '../../pureStyledComponents/EmptyContent'
import { PageTitle } from '../../pureStyledComponents/PageTitle'
import AuctionInfoCard from '../AuctionInfoCard'

const Wrapper = styled.div`
  margin-bottom: 40px;
`

const Row = styled.div`
  column-gap: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`

const SectionTitle = styled(PageTitle)`
  margin: 0 0 40px;
`

const Loading = styled(InlineLoading)`
  min-height: 290px;
`

interface Props {
  featuredAuctions: Maybe<AuctionInfo[]>
}

export const FeaturedAuctions = (props: Props) => {
  const { featuredAuctions, ...restProps } = props

  const auctions = React.useMemo(() => featuredAuctions && featuredAuctions.slice(0, 3), [
    featuredAuctions,
  ])

  return (
    <Wrapper {...restProps}>
      <SectionTitle as="h2" className="featuredAuctionsTitle">
        Featured Auctions
      </SectionTitle>
      {(featuredAuctions === undefined || featuredAuctions === null) && (
        <Loading message="Loading..." size={SpinnerSize.small} />
      )}
      {featuredAuctions && featuredAuctions.length === 0 && (
        <EmptyContentWrapper>
          <InfoIcon />
          <EmptyContentText>No featured auctions.</EmptyContentText>
        </EmptyContentWrapper>
      )}
      {auctions && auctions.length > 0 && (
        <Row>
          {auctions.map((auction, index) => (
            <AuctionInfoCard auctionInfo={auction} key={index} />
          ))}
        </Row>
      )}
    </Wrapper>
  )
}
