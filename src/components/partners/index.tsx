import React from 'react'
import styled from 'styled-components'

import LitProtocolIcon from '../../assets/images/lit-protocol-logo.png'
import GraphIcon from '../../assets/images/the-graph.png'
import { PageTitle } from '../pureStyledComponents/PageTitle'

const Wrapper = styled.div`
  margin: 0 auto 32px;
  max-width: 100%;
  width: 400px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    width: 100%;
  }
`
const SubTitle = styled.h2`
  color: white;
  font-size: 40px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  padding: 20px 0 20px;
  text-align: left;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    text-align: left;
  }
`

const BlockGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 10px;
  margin-bottom: 10px;
  column-gap: 100px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    grid-template-columns: 1fr 1fr;
    // margin-bottom: 100px;
    padding: 0 0px;
  }
`

const InnerBlock = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 10px;
  margin-bottom: 10px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    grid-template-columns: 0.6fr 1.4fr;
    margin-bottom: 100px;
    align-items: center;
    padding: 0px;
  }
`

const ImageBlock = styled.div<{ align: string }>`
  display: flex;
  justify-content: center;
  text-align: center;
  margin-bottom: 10px;
  order: 0;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    ${(props) => props.align === 'left' && 'padding-left: 30px; justify-content: flex-start;'}
    ${(props) => props.align === 'right' && 'padding-right: 60px; justify-content: flex-end;'}
    margin-bottom: 0;
  }
`
const ImageStyle = { width: '94px', height: '117px' }

// const imageElement = require()

export const Partners: React.FC = (props) => {
  const { ...restProps } = props
  return (
    <Wrapper {...restProps}>
      <PageTitle as="h2" className="featuredAuctionsTitle">
        Our Partners
      </PageTitle>
      <BlockGrid>
        <InnerBlock>
          <ImageBlock align="left">
            <img src={LitProtocolIcon} style={ImageStyle} />
          </ImageBlock>
          <SubTitle>Lit Protocol</SubTitle>
        </InnerBlock>
        <InnerBlock>
          <ImageBlock align="left">
            <img src={GraphIcon} style={{ width: '106px', height: '117px' }} />
          </ImageBlock>
          <SubTitle>The Graph Protocol</SubTitle>
        </InnerBlock>
      </BlockGrid>
    </Wrapper>
  )
}
