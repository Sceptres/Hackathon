import {React,useState} from 'react';
import ReactMarkdown from 'react-markdown';
import "./markdown.css"

const kidsVersion = `# **Simple Stock Investment Guide for Kids**

## **What Are Stocks?**

Imagine you own a small piece of your favorite toy store. When the store makes money, you get a little bit of it too. That's what a stock is – owning a tiny part of a company!

### **Example:**
- **Toy Store Stock:** If you buy a stock of your favorite toy store, you own a little part of it.

## **Why Invest in Stocks?**

When you invest in stocks, you have a chance to make your money grow. If the toy store becomes super popular and makes more money, the value of your stock goes up, and you can sell it for more money than you paid!

### **Why It's Cool:**
- **More Money:** Your money can grow if the company does well.
- **Owning Cool Stuff:** You get to own a piece of a company you like.

## **Types of Stocks**

Not all stocks are the same. Here are two simple types:

### **Common Stocks:**
- **What They Are:** The usual type where you own part of the company and can sometimes vote on decisions.
- **Example:** Owning stock in a big toy company.

### **Preferred Stocks:**
- **What They Are:** These stocks give you money first if the company pays dividends (extra money to owners) but don’t let you vote.
- **Example:** Owning stock in a company that makes your favorite candy.

## **How to Start Investing**

Here’s how you can start investing:

### **Step 1: Set a Goal**
- **Why:** Decide what you’re saving for, like a new bike or a video game.

### **Step 2: Save Some Money**
- **Why:** You’ll need some money to buy your first stock.

### **Step 3: Ask an Adult to Help You Buy Stocks**
- **Why:** You’ll need a grown-up to help you set up an account to buy stocks.

### **Step 4: Pick a Company You Like**
- **Why:** Choose a company that makes things you love, like toys or snacks.

## **How to Invest Smartly**

Investing smartly means thinking before you buy stocks. Here are some tips:

### **Tip 1: Don’t Put All Your Eggs in One Basket**
- **Why:** Don’t spend all your money on one company. Spread it out so if one stock loses value, you still have others.

### **Tip 2: Be Patient**
- **Why:** Sometimes stocks go up and down. It’s okay to wait for them to go back up.

### **Tip 3: Learn About the Company**
- **Why:** Make sure the company is doing well and making money.

## **Things to Watch Out For**

Here are some things to be careful about:

### **1. Don’t Buy Just Because It’s Popular**
- **Why:** Just because everyone is talking about a stock doesn’t mean it’s the best choice.

### **2. Don’t Panic If the Price Drops**
- **Why:** Stock prices go up and down. If you wait, they might go back up.

## **Learning More**

Want to learn more? Here are some ways:

### **Books:**
- *A Kid’s Guide to Saving and Investing* by David Gardner

### **Websites:**
- **Investopedia for Kids:** Learn more about money and investing.

---

**Remember:** Investing is like planting a tree. It might take time to grow, but with care, it can become something big and strong!
`
const markdownContent = `
# **Stock Investment Guide Adults**

## **Introduction**

Welcome to the Stock Investment Guide! This guide is designed to help students understand the basics of investing in stocks. Whether you're new to investing or looking to refine your strategy, this guide will provide you with the knowledge and tools to start your journey.

## **Table of Contents**

1. [What Are Stocks?](#what-are-stocks)
2. [Why Invest in Stocks?](#why-invest-in-stocks)
3. [Types of Stocks](#types-of-stocks)
4. [Getting Started with Stock Investing](#getting-started-with-stock-investing)
5. [Investment Strategies](#investment-strategies)
6. [Fundamental Analysis](#fundamental-analysis)
7. [Technical Analysis](#technical-analysis)
8. [Diversification](#diversification)
9. [Risk Management](#risk-management)
10. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
11. [Resources for Further Learning](#resources-for-further-learning)

---

## **1. What Are Stocks?**

Stocks represent ownership in a company. When you buy a stock, you become a shareholder, owning a small part of that company. The value of your stock may increase or decrease based on the company's performance and market conditions.

### **Example:**
- **Apple Inc. (AAPL):** If you buy shares of Apple, you own a portion of the company and are entitled to a share of the profits, typically distributed as dividends.

## **2. Why Invest in Stocks?**

Investing in stocks allows you to potentially grow your wealth over time. Historically, the stock market has provided higher returns compared to other investments like bonds or savings accounts.

### **Key Reasons to Invest:**
- **Potential for High Returns:** Over the long term, stocks have outperformed other asset classes.
- **Dividend Income:** Some stocks pay dividends, providing a steady income stream.
- **Ownership in Companies:** Owning stocks gives you a stake in some of the largest and most successful companies in the world.

## **3. Types of Stocks**

Stocks can be categorized into different types, each with unique characteristics.

### **Common Stocks:**
- **Definition:** Most common type of stock, giving shareholders voting rights and dividends.
- **Example:** Buying common stock in a company like Microsoft.

### **Preferred Stocks:**
- **Definition:** These stocks offer higher dividend payments and priority over common stocks in the event of liquidation, but usually lack voting rights.
- **Example:** A utility company might issue preferred stock.

### **Growth Stocks:**
- **Definition:** Stocks of companies expected to grow at an above-average rate compared to other companies.
- **Example:** Technology companies like Tesla.

### **Value Stocks:**
- **Definition:** Stocks that appear undervalued based on fundamental analysis.
- **Example:** Established companies with strong fundamentals, like Johnson & Johnson.

## **4. Getting Started with Stock Investing**

Before you start investing, follow these steps:

### **Step 1: Set Financial Goals**
- **Short-Term Goals:** Pay off debt, save for a vacation.
- **Long-Term Goals:** Retirement, buying a house.

### **Step 2: Open a Brokerage Account**
- **Examples:** Robinhood, E*TRADE, Fidelity.

### **Step 3: Determine Your Investment Budget**
- **Tip:** Only invest money you can afford to lose.

### **Step 4: Research and Choose Stocks**
- **Tools:** Yahoo Finance, Google Finance, stock screeners.

## **5. Investment Strategies**

Different strategies can help you achieve your investment goals.

### **Value Investing**
- **Description:** Buying undervalued stocks and holding them until they reach their true value.
- **Famous Practitioner:** Warren Buffett.

### **Growth Investing**
- **Description:** Investing in companies expected to grow significantly in the future.
- **Example:** Buying shares of Amazon in its early days.

### **Dividend Investing**
- **Description:** Focusing on companies that pay regular dividends.
- **Example:** Procter & Gamble, Coca-Cola.

## **6. Fundamental Analysis**

Fundamental analysis involves evaluating a company's financial health to determine its stock's value.

### **Key Metrics:**
- **Price-to-Earnings Ratio (P/E):** Measures a company's current share price relative to its per-share earnings.
- **Debt-to-Equity Ratio (D/E):** Indicates financial leverage, calculated by dividing total liabilities by shareholders' equity.
- **Earnings Per Share (EPS):** A company's profit divided by the outstanding shares of its common stock.

### **Example:**
- **Apple's P/E Ratio:** Used to compare Apple's stock price with its earnings to determine if it's over or under-valued.

## **7. Technical Analysis**

Technical analysis involves studying past market data, primarily price and volume, to forecast future price movements.

### **Key Techniques:**
- **Moving Averages:** An average of a stock's price over a specific period, used to identify trends.
- **Relative Strength Index (RSI):** A momentum oscillator that measures the speed and change of price movements.
- **Support and Resistance Levels:** Price levels on charts that tend to act as barriers to prevent the price from moving in a certain direction.

### **Example:**
- **Using RSI:** Identify overbought or oversold conditions in a stock.

## **8. Diversification**

Diversification is the practice of spreading your investments across different assets to reduce risk.

### **Diversification Tips:**
- **Invest in Different Sectors:** Technology, healthcare, finance, etc.
- **Mix Asset Classes:** Stocks, bonds, real estate.
- **Geographical Diversification:** Invest in international markets.

### **Example:**
- **Portfolio Mix:** 50% U.S. stocks, 20% international stocks, 20% bonds, 10% real estate.

## **9. Risk Management**

Managing risk is crucial in investing to protect your capital.

### **Key Techniques:**
- **Stop-Loss Orders:** Automatically sell a stock when it reaches a certain price.
- **Position Sizing:** Determine how much to invest in each stock.
- **Diversification:** Spread your investments to reduce the impact of any one stock's performance.

### **Example:**
- **Stop-Loss Order:** Setting a stop-loss at 10% below the purchase price to limit losses.

## **10. Common Mistakes to Avoid**

Avoid these common pitfalls when investing:

### **1. Lack of Research**
- **Mistake:** Investing in a stock without understanding the company.
- **Solution:** Always research the company, its industry, and its competitors.

### **2. Emotional Investing**
- **Mistake:** Making investment decisions based on emotions, such as fear or greed.
- **Solution:** Stick to your investment strategy and avoid reacting to short-term market fluctuations.

### **3. Overtrading**
- **Mistake:** Buying and selling stocks too frequently, leading to high transaction costs.
- **Solution:** Adopt a long-term investment perspective.

### **4. Ignoring Fees**
- **Mistake:** Overlooking the impact of brokerage fees and taxes.
- **Solution:** Choose a brokerage with low fees and consider tax-efficient investment strategies.

## **11. Resources for Further Learning**

Expand your knowledge with these resources:

### **Books:**
- *The Intelligent Investor* by Benjamin Graham
- *Common Stocks and Uncommon Profits* by Philip Fisher
- *One Up On Wall Street* by Peter Lynch

### **Online Courses:**
- **Coursera:** Finance & Quantitative Modeling for Analysts
- **Udemy:** Stock Market Investing for Beginners
- **edX:** Introduction to Corporate Finance

### **Websites:**
- **Investopedia:** [Investopedia](https://www.investopedia.com/)
- **Yahoo Finance:** [Yahoo Finance](https://finance.yahoo.com/)
- **Seeking Alpha:** [Seeking Alpha](https://seekingalpha.com/)

---

This guide is intended to be a comprehensive starting point for students looking to understand and invest in the stock market. By following the strategies and techniques outlined, students can develop a solid foundation in stock investing.
`;

const GuideMarkdown = () => {
    const [selectedGuide, setSelectedGuide] = useState(0);


const getMarkdownContent = () => {
    if (selectedGuide === 'kids') {
      return kidsVersion;
    } else if (selectedGuide === 'Adults'){
      return markdownContent;
    }
  };

  return (
    <div className="markdown-selector">
      <h1>Select a Guide</h1>
      <div className="guide-selection">
        <label>
          <input
            type="radio"
            value="kids"
            checked={selectedGuide === 'kids'}
            onChange={(e) => setSelectedGuide(e.target.value)}
          />
          Guide for Kids
        </label>
        <label>
          <input
            type="radio"
            value="Adults"
            checked={selectedGuide === 'Adults'}
            onChange={(e) => setSelectedGuide(e.target.value)}
          />
          Guide for Adults
        </label>
      </div>
      <div className="markdown-guide">
        <ReactMarkdown>{getMarkdownContent()}</ReactMarkdown>
      </div>
    </div>
  );
};

export default GuideMarkdown;
