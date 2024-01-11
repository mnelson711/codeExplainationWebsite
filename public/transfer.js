
let responseText = "loading";

function displayResult(text) {
  const responseContainer = document.getElementById("responseContainer");
  responseContainer.textContent = text;
}

async function submitForm() {
  const oldlanguage = document.getElementById("oldlanguage").value;
  const newlanguage = document.getElementById("newlanguage").value;
  const code = document.getElementById("code").value;

  if (!oldlanguage || !newlanguage || !code) {
    return;
  }

  // responseContainer = document.getElementById('responseContainer');
  displayResult("Loading...");

  try {
    const response = await fetch("/switch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldlanguage: oldlanguage, newlanguage: newlanguage, code: code }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.text();
    // const responseContainer = document.getElementById("responseContainer");
    displayResult(responseData);
    // responseText = responseData;
    // return responseData;
  } catch (error) {
    console.error("Error:", error.message);
    displayResult("Error fetching data");
  }
}
// let responseText = "loading";
// responseContainer.innerHTML = responseText;
console.log("finished");
