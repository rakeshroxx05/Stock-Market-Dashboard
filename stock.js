const apiKey = "3GI4SVCH0KHQ9M9V";

// Get Single Stock
function getStock() {
  const symbol = document.getElementById("stockSymbol").value.toUpperCase();
  const result = document.getElementById("priceResult");

  if (!symbol) {
    result.innerText = "Please enter a stock symbol.";
    return;
  }

  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data); // DEBUG

      if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
        const price = data["Global Quote"]["05. price"];
        result.innerText = `Price of ${symbol}: $${price}`;
      } else if (data["Note"]) {
        result.innerText = "API limit reached. Wait 1 minute and try again.";
      } else {
        result.innerText = "Invalid stock symbol or API error.";
      }
    })
    .catch(() => {
      result.innerText = "Network error. Try again.";
    });
}

// Compare Two Stocks
function compareStocks() {
  const s1 = document.getElementById("stock1").value.toUpperCase();
  const s2 = document.getElementById("stock2").value.toUpperCase();
  const result = document.getElementById("compareResult");

  if (!s1 || !s2) {
    result.innerText = "Please enter both stock symbols.";
    return;
  }

  const url1 = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${s1}&apikey=${apiKey}`;
  const url2 = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${s2}&apikey=${apiKey}`;

  Promise.all([fetch(url1), fetch(url2)])
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(data => {
      console.log(data); // DEBUG

      const d1 = data[0]["Global Quote"];
      const d2 = data[1]["Global Quote"];

      if (d1 && d1["05. price"] && d2 && d2["05. price"]) {
        const p1 = d1["05. price"];
        const p2 = d2["05. price"];

        result.innerText = `${s1}: $${p1}  |  ${s2}: $${p2}`;
      } else {
        result.innerText = "API limit or invalid symbol. Try again later.";
      }
    })
    .catch(() => {
      result.innerText = "Error fetching comparison data.";
    });
}

// Stock News
function getNews() {
  const newsDiv = document.getElementById("news");
  newsDiv.innerHTML = "Loading news...";

  const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=financial_markets&apikey=${apiKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data); // DEBUG

      if (!data.feed) {
        newsDiv.innerText = "API limit reached. Try later.";
        return;
      }

      newsDiv.innerHTML = "";
      data.feed.slice(0, 5).forEach(item => {
        const div = document.createElement("div");
        div.className = "news-item";
        div.innerHTML = `<b>${item.title}</b><br>${item.summary}`;
        newsDiv.appendChild(div);
      });
    })
    .catch(() => {
      newsDiv.innerText = "Error loading news.";
    });
}
