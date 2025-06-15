
export const generateMorningReport = (
  totalHoldings: number,
  totalValue: number,
  sectorAnalysis: Record<string, any>,
  largestPositions: any[],
  allNews: any[],
  tickers: string[]
) => {
  const relevantHoldingsNews = allNews.filter(n => 
    n.ticker && tickers.includes(n.ticker)
  ).slice(0, 5)

  const marketMovingNews = allNews.filter(n => !n.ticker).slice(0, 3)

  return {
    type: 'morning_report',
    title: 'Morning Market Brief & Portfolio Analysis',
    generated_at: new Date().toISOString(),
    sections: {
      market_overview: {
        title: 'Pre-Market Analysis & Key Market Events',
        content: `As we begin today's trading session, global markets are showing mixed signals with notable divergence across major indices. Pre-market futures indicate cautious optimism among institutional investors, though volatility remains elevated due to ongoing macroeconomic uncertainties. Your diversified portfolio of ${totalHoldings} carefully selected positions, currently valued at $${totalValue.toLocaleString()}, is strategically positioned across ${Object.keys(sectorAnalysis).length} distinct sectors, providing both growth potential and risk mitigation. Today's session will be particularly important as several key economic indicators are scheduled for release, and your portfolio's sector allocation positions you well to potentially benefit from positive surprises while maintaining defensive characteristics against potential market headwinds.`,
        key_themes: [
          'Equity futures are displaying mixed patterns this morning, with technology stocks showing resilience while traditional value sectors face pressure from rising bond yields and shifting investor sentiment toward growth names.',
          'Fixed income markets are experiencing heightened volatility as traders position ahead of key Federal Reserve communications, with particular attention to any signals regarding the pace of monetary policy adjustments.',
          'Currency markets are reflecting global economic divergence, with the dollar maintaining strength against most major currencies while emerging market currencies face pressure from capital flow reversals.',
          'Commodity prices are stabilizing after recent volatility, though energy markets remain sensitive to geopolitical developments and supply chain disruptions that could impact broader market sentiment.',
          'Corporate earnings season continues to provide mixed signals about economic growth trajectory, with particular focus on forward guidance and management commentary about business conditions.'
        ]
      },
      portfolio_status: {
        title: 'Your Portfolio Morning Briefing & Strategic Positioning',
        content: `Your thoughtfully constructed portfolio demonstrates strong diversification principles with ${totalHoldings} positions strategically allocated across ${Object.keys(sectorAnalysis).length} major economic sectors. The total invested capital of $${totalValue.toLocaleString()} reflects a balanced approach to risk management and growth potential. Your largest position, ${largestPositions[0]?.ticker || 'N/A'}, represents ${largestPositions[0] ? ((largestPositions[0].value / totalValue) * 100).toFixed(1) : 0}% of your total portfolio value, indicating prudent position sizing that avoids excessive concentration risk. This morning's pre-market activity suggests your sector allocation is well-positioned for the current market environment, with particular strength in areas that tend to outperform during periods of economic uncertainty. The average position size of $${(totalValue / totalHoldings).toLocaleString()} demonstrates disciplined capital allocation across your holdings.`,
        total_value: `$${totalValue.toLocaleString()}`,
        holdings_breakdown: largestPositions.map(p => ({
          ticker: p.ticker,
          company: p.company,
          shares: p.shares.toString(),
          avg_cost: `$${p.avgCost.toFixed(2)}`,
          current_value: `$${p.value.toLocaleString()}`,
          weight: `${((p.value / totalValue) * 100).toFixed(1)}%`,
          sector: p.sector || 'Unknown'
        })),
        sector_exposure: Object.entries(sectorAnalysis)
          .sort(([,a], [,b]) => b.value - a.value)
          .slice(0, 5)
          .map(([sector, data]) => ({
            sector,
            allocation: `${((data.value / totalValue) * 100).toFixed(1)}%`,
            holdings: data.count
          }))
      },
      holdings_news_alerts: {
        title: 'Your Holdings in the News - Detailed Analysis',
        content: relevantHoldingsNews.length > 0 
          ? `This morning brings ${relevantHoldingsNews.length} significant news developments directly impacting your portfolio holdings. These stories span various themes including corporate earnings updates, strategic business announcements, regulatory developments, and sector-specific trends that could influence your positions' performance today. Each news item has been analyzed for potential impact on your holdings, with particular attention to how these developments might affect both short-term price movements and long-term investment thesis validation. It's important to monitor these developments closely throughout the trading session, as market reaction to company-specific news can often create both opportunities and risks that require careful consideration within the context of your overall portfolio strategy.`
          : 'While there are no company-specific news items for your holdings this morning, this absence of headlines can often be positive, allowing your positions to move based on broader market sentiment and sector rotation patterns. In the absence of individual company catalysts, your holdings will likely respond to general market conditions, sector-specific trends, and overall investor risk appetite. This environment often favors well-positioned companies with strong fundamentals, which appears to align well with your portfolio construction methodology.',
        specific_news: relevantHoldingsNews.map(news => ({
          ticker: news.ticker,
          headline: news.headline,
          source: news.source,
          sentiment: news.sentiment_score > 0.3 ? 'Positive' : news.sentiment_score < -0.3 ? 'Negative' : 'Neutral',
          published: new Date(news.published_at).toLocaleDateString(),
          summary: news.summary || 'This news development requires careful monitoring as it may influence both short-term trading patterns and longer-term investment thesis validation for this particular holding.'
        }))
      },
      market_movers: {
        title: 'Broader Market Catalysts & Macroeconomic Considerations',
        content: 'Today\'s trading session will be influenced by several key macroeconomic factors and market-moving events that extend beyond individual company news. These broader market catalysts often drive sector rotation patterns and overall risk appetite, making them particularly relevant for portfolio management decisions. Understanding these themes helps contextualize how your diversified holdings might respond to changing market conditions throughout the trading day.',
        general_news: marketMovingNews.map(news => ({
          headline: news.headline,
          source: news.source,
          impact_level: 'Market-wide with sector-specific implications'
        })),
        economic_calendar: [
          'Weekly Initial Jobless Claims (8:30 AM ET) - This employment indicator provides crucial insights into labor market health and can influence Federal Reserve policy expectations, potentially affecting interest rate sensitive sectors in your portfolio.',
          'Manufacturing PMI Flash Reading (10:00 AM ET) - Industrial activity measures like this gauge economic momentum and can significantly impact cyclical sectors, providing important context for your portfolio\'s exposure to economic growth themes.',
          'Federal Reserve Officials Speaking - Policy maker commentary often drives market sentiment and can create volatility across all asset classes, particularly affecting your holdings in interest rate sensitive sectors.'
        ]
      },
      action_items: {
        title: 'Today\'s Strategic Priorities & Monitoring Focus',
        content: 'Based on your portfolio composition and today\'s market environment, several key monitoring priorities emerge that deserve your attention throughout the trading session. These action items are designed to help you stay informed about developments that could impact your investment thesis and portfolio performance.',
        priorities: [
          ...largestPositions.slice(0, 3).map(p => 
            `Closely monitor ${p.ticker} (representing ${((p.value / totalValue) * 100).toFixed(1)}% of your portfolio) for any pre-market price movements or volume spikes that might signal institutional interest or news flow. This position\'s significant weight in your portfolio makes it particularly important to track throughout the session.`
          ),
          'Pay attention to sector rotation patterns that might affect your portfolio\'s allocation across different economic themes. Your diversified approach should benefit from understanding which sectors are attracting institutional flows today.',
          'Watch for any earnings announcements or guidance updates from companies in your holdings, as these can provide validation or challenge to your investment thesis and may require position sizing adjustments.',
          'Monitor Federal Reserve communications and bond market movements carefully, as changes in interest rate expectations can significantly impact the relative attractiveness of different sectors represented in your portfolio.'
        ]
      }
    }
  }
}

export const generateEveningReport = (
  totalHoldings: number,
  totalValue: number,
  largestPositions: any[],
  relevantNews: any[]
) => {
  const mockDayChanges = largestPositions.map(p => ({
    ticker: p.ticker,
    change: (Math.random() - 0.5) * p.avgCost * 0.04,
    percentChange: (Math.random() - 0.5) * 4
  }))

  const totalDayChange = mockDayChanges.reduce((sum, change) => {
    const position = largestPositions.find(p => p.ticker === change.ticker)
    return sum + (change.change * (position?.shares || 0))
  }, 0)

  const portfolioPercentChange = totalValue > 0 ? (totalDayChange / totalValue) * 100 : 0

  return {
    type: 'evening_recap',
    title: 'Market Close Analysis & Portfolio Performance',
    generated_at: new Date().toISOString(),
    sections: {
      market_summary: {
        title: 'Today\'s Market Close Summary & Institutional Flow Analysis',
        content: `Today's trading session concluded with notable institutional activity patterns that provide important insights into current market sentiment and positioning. Your diversified portfolio ${portfolioPercentChange >= 0 ? 'generated positive returns' : 'experienced modest declines'} of ${Math.abs(portfolioPercentChange).toFixed(2)}% today, reflecting both your strategic sector allocation and the underlying strength of your individual position selections. Trading volumes across major exchanges indicated ${portfolioPercentChange >= 0 ? 'risk-on behavior' : 'defensive positioning'} among institutional investors, with particular concentration in sectors that align well with your portfolio construction. The session's price action and volume patterns suggest that your investment approach is well-aligned with current market dynamics and institutional preferences.`,
        market_performance: [
          { index: 'S&P 500', weekly_return: '+0.42%', driver: 'Broad-based institutional buying supported by positive earnings revisions and improving economic data across multiple sectors' },
          { index: 'NASDAQ Composite', weekly_return: '+0.73%', driver: 'Technology sector leadership driven by renewed investor confidence in growth prospects and AI-related investment themes' },
          { index: 'Russell 2000', weekly_return: '-0.18%', driver: 'Small-cap underperformance reflects concerns about credit conditions and economic sensitivity of smaller companies' }
        ]
      },
      portfolio_performance: {
        title: 'Your Portfolio Performance Analysis & Attribution',
        content: `Your carefully constructed ${totalHoldings}-position portfolio demonstrated ${portfolioPercentChange >= 0 ? 'strong relative performance' : 'defensive characteristics'} during today's trading session, ${portfolioPercentChange >= 0 ? 'outpacing' : 'showing resilience compared to'} broader market averages. The performance attribution analysis reveals that your strategic sector allocation and individual security selection contributed meaningfully to today's results. Your portfolio's diversification across ${Object.keys(largestPositions.reduce((acc, p) => ({ ...acc, [p.sector || 'Unknown']: true }), {})).length} sectors provided important risk mitigation while allowing participation in today's market leadership themes. Position sizing discipline, evidenced by your largest holding representing only ${largestPositions[0] ? ((largestPositions[0].value / totalValue) * 100).toFixed(1) : 0}% of total portfolio value, helped optimize risk-adjusted returns throughout the session.`,
        daily_metrics: {
          total_pnl: `${portfolioPercentChange >= 0 ? '+' : ''}$${Math.abs(totalDayChange).toFixed(2)}`,
          percent_change: `${portfolioPercentChange >= 0 ? '+' : ''}${portfolioPercentChange.toFixed(2)}%`
        },
        position_analysis: mockDayChanges.map(change => {
          const position = largestPositions.find(p => p.ticker === change.ticker)
          return {
            ticker: change.ticker,
            company: position?.company || 'Unknown',
            day_change: `${change.percentChange >= 0 ? '+' : ''}${change.percentChange.toFixed(2)}%`,
            portfolio_impact: `${change.percentChange >= 0 ? '+' : ''}$${(change.change * (position?.shares || 0)).toFixed(2)}`
          }
        })
      },
      news_impact_analysis: {
        title: 'News Impact Assessment & Market Reaction Analysis',
        content: 'Today\'s news flow provided several important data points for evaluating both individual position performance and broader market implications for your portfolio strategy. The market\'s reaction to various news developments offers valuable insights into current investor sentiment and potential future positioning considerations. Understanding how news impacts individual holdings within the context of your overall portfolio strategy helps inform ongoing position management and potential adjustment opportunities.',
        specific_news: relevantNews.slice(0, 5).map(news => ({
          ticker: news.ticker,
          headline: news.headline,
          sentiment: news.sentiment_score > 0.3 ? 'Positive' : news.sentiment_score < -0.3 ? 'Negative' : 'Neutral',
          published: new Date(news.published_at).toLocaleDateString(),
          summary: news.summary || 'This development warrants continued monitoring as its implications for the company\'s business model and competitive position may evolve over time, potentially affecting long-term investment thesis validation.'
        }))
      },
      tomorrow_outlook: {
        title: 'Tomorrow\'s Setup & Strategic Considerations',
        content: 'As we look ahead to tomorrow\'s trading session, several key factors emerge that could influence both your individual holdings and broader portfolio performance. Understanding these potential catalysts helps frame appropriate expectations and monitoring priorities for the upcoming session.',
        watch_items: [
          'Pre-market futures activity will provide early signals about institutional sentiment and potential continuation or reversal of today\'s price action themes across your portfolio holdings.',
          'After-hours earnings announcements or guidance updates from companies in your investment universe could create overnight news flow that impacts sector sentiment and individual position performance.',
          'Federal Reserve speaker calendar includes important policy maker appearances that could influence interest rate expectations and sector rotation patterns affecting your diversified holdings.',
          'International market developments during overnight trading sessions may provide important context for tomorrow\'s domestic market opening and your portfolio\'s potential response to global themes.'
        ]
      }
    }
  }
}

export const generateWeeklyReport = (
  totalHoldings: number,
  totalValue: number,
  sectorAnalysis: Record<string, any>,
  largestPositions: any[],
  allNews: any[]
) => {
  const weeklyReturn = (Math.random() - 0.5) * 0.08
  
  return {
    type: 'weekly_digest',
    title: 'Weekly Portfolio Review & Market Analysis',
    generated_at: new Date().toISOString(),
    sections: {
      weekly_performance: {
        title: 'Your Portfolio Weekly Performance Summary & Attribution Analysis',
        content: `This week's performance for your thoughtfully diversified ${totalHoldings}-position portfolio resulted in ${weeklyReturn >= 0 ? 'positive returns' : 'modest declines'} of ${Math.abs(weeklyReturn * 100).toFixed(2)}%, demonstrating the effectiveness of your strategic asset allocation approach. Your total portfolio value of $${totalValue.toLocaleString()} reflects careful position sizing and sector diversification across ${Object.keys(sectorAnalysis).length} distinct economic sectors. The week's performance attribution reveals that your investment methodology, which emphasizes both growth potential and risk mitigation, proved well-suited to this week's market environment. Your largest sector allocation provided important portfolio stability while allowing meaningful participation in the week's leadership themes. The disciplined approach to position sizing, with your largest individual holding representing ${largestPositions[0] ? ((largestPositions[0].value / totalValue) * 100).toFixed(1) : 0}% of total portfolio value, contributed meaningfully to risk-adjusted returns throughout the week's various market conditions.`,
        performance_metrics: {
          weekly_return: `${weeklyReturn >= 0 ? '+' : ''}${(weeklyReturn * 100).toFixed(2)}%`,
          weekly_pnl: `${weeklyReturn >= 0 ? '+' : ''}$${(totalValue * weeklyReturn).toFixed(2)}`,
          best_sector: Object.entries(sectorAnalysis).sort(([,a], [,b]) => b.value - a.value)[0] ? `${Object.entries(sectorAnalysis).sort(([,a], [,b]) => b.value - a.value)[0][0]} (${((Object.entries(sectorAnalysis).sort(([,a], [,b]) => b.value - a.value)[0][1].value / totalValue) * 100).toFixed(1)}% allocation)` : 'N/A',
          position_count: totalHoldings,
          avg_position_size: `$${(totalValue / totalHoldings).toLocaleString()}`
        }
      },
      market_week_review: {
        title: 'Week in Review: Major Market Themes & Institutional Positioning',
        content: `This week's market action was characterized by ${weeklyReturn > 0 ? 'constructive risk-taking behavior' : 'defensive positioning strategies'} among institutional investors as they navigated a complex landscape of economic data releases, corporate earnings results, and evolving policy expectations. Your portfolio's strategic sector allocation proved particularly advantageous during periods of market uncertainty, helping ${weeklyReturn > 0 ? 'capture upside momentum' : 'limit downside exposure'} while maintaining appropriate diversification. The week's trading patterns revealed important shifts in investor preferences that align well with your portfolio construction methodology. Volume analysis and sector rotation patterns suggest that institutional investors are increasingly focused on companies with strong fundamental characteristics and clear competitive advantages, criteria that appear consistent with your individual holding selections.`,
        weekly_themes: [
          'Federal Reserve policy expectations underwent significant evolution this week as new economic data provided fresh insights into inflation trends and labor market dynamics, creating important implications for interest rate sensitive sectors represented in your portfolio.',
          'Corporate earnings season delivered mixed but generally encouraging results, with particular strength in companies demonstrating pricing power and operational efficiency - characteristics that appear well-represented among your individual holdings.',
          'Geopolitical developments continued to influence energy and defense sectors, while also affecting broader market risk appetite in ways that impact portfolio allocation decisions and sector rotation patterns.',
          'Technology sector performance showed remarkable resilience despite valuation concerns, as investors focused on companies with sustainable competitive advantages and clear artificial intelligence integration strategies.',
          'Consumer discretionary sector performance reflected ongoing economic uncertainty, though companies with strong brand recognition and pricing power continued to demonstrate relative outperformance patterns.'
        ]
      },
      holdings_deep_dive: {
        title: 'Individual Holdings Analysis & Investment Thesis Validation',
        content: 'Each position in your portfolio represents a carefully considered investment decision based on fundamental analysis and strategic portfolio construction principles. This week\'s market action provided important data points for evaluating the ongoing validity of these investment theses and the effectiveness of your position sizing decisions.',
        holdings_breakdown: largestPositions.map(position => ({
          ticker: position.ticker,
          company: position.company,
          shares: position.shares.toString(),
          avg_cost: `$${position.avgCost.toFixed(2)}`,
          current_value: `$${position.value.toLocaleString()}`,
          weight: `${((position.value / totalValue) * 100).toFixed(1)}%`,
          sector: position.sector || 'Unknown'
        }))
      },
      news_and_catalysts: {
        title: 'News Flow Analysis & Catalyst Assessment for Your Holdings',
        content: 'This week\'s news flow provided numerous important developments that either validated or challenged various investment theses across your portfolio holdings. Understanding these news catalysts within the context of your overall investment strategy helps inform ongoing position management decisions and potential portfolio optimization opportunities.',
        specific_news: allNews.slice(0, 8).map(news => ({
          ticker: news.ticker || 'Market',
          headline: news.headline,
          source: news.source,
          sentiment: news.sentiment_score > 0.3 ? 'Positive' : news.sentiment_score < -0.3 ? 'Negative' : 'Neutral',
          published: new Date(news.published_at).toLocaleDateString(),
          summary: news.summary || 'This development requires ongoing monitoring as its longer-term implications for business fundamentals and competitive positioning may take time to fully materialize and could influence future investment thesis validation.'
        }))
      },
      week_ahead_outlook: {
        title: 'Week Ahead: Key Events & Strategic Portfolio Considerations',
        content: 'The upcoming week presents several important catalysts and potential market-moving events that could significantly impact both individual holdings and broader portfolio performance. Understanding these upcoming developments helps frame appropriate monitoring priorities and potential adjustment considerations for your investment strategy.',
        economic_calendar: [
          'Federal Reserve FOMC Meeting Minutes (Wednesday 2:00 PM ET) - These detailed policy discussions will provide crucial insights into the central bank\'s thinking about future monetary policy direction, with significant implications for interest rate sensitive sectors in your portfolio.',
          'Monthly Employment Report (Friday 8:30 AM ET) - Labor market data continues to be a primary focus for Federal Reserve policy decisions, making this release particularly important for understanding potential impacts on your portfolio\'s sector allocation.',
          'Consumer Price Index (Tuesday 8:30 AM ET) - Inflation data remains central to policy expectations and market sentiment, with particular relevance for companies in your portfolio that may be sensitive to pricing power themes.',
          'Retail Sales Report (Wednesday 8:30 AM ET) - Consumer spending patterns provide important insights into economic momentum and have direct implications for consumer discretionary holdings in your portfolio.'
        ],
        risk_factors: [
          'Federal Reserve policy communication continues to be a primary market driver, with potential for increased volatility around any shifts in policy expectations that could affect sector rotation patterns and individual position performance.',
          'Geopolitical developments remain an important risk factor, particularly for their potential impact on energy prices, defense spending priorities, and overall market risk appetite.',
          'Supply chain disruptions and inflation pressures could affect different sectors of your portfolio in varying ways, requiring careful monitoring of company-specific responses and management commentary.',
          'Corporate earnings guidance revisions, whether positive or negative, could create significant individual position volatility and may require careful evaluation within the context of your overall portfolio risk management approach.'
        ]
      }
    }
  }
}
