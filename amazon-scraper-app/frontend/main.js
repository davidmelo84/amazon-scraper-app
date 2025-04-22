document.getElementById("searchBtn").addEventListener("click", async () => {
  const keyword = document.getElementById("keyword").value;
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const data = await res.json();

    if (!Array.isArray(data)) {
      resultsContainer.innerHTML = `<p>Error: ${data.error}</p>`;
      return;
    }

    resultsContainer.innerHTML = "";
    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = \`
        <img src="\${item.image}" alt="\${item.title}" />
        <h3>\${item.title}</h3>
        <p>⭐ \${item.rating || "N/A"} (\${item.reviews || "0"} reviews)</p>
      \`;
      resultsContainer.appendChild(div);
    });
  } catch (err) {
    resultsContainer.innerHTML = `<p>Failed to fetch data</p>`;
  }
});