
  document.addEventListener("click", async (e) => {

    // LIKE
    if (e.target.classList.contains("like-btn")) {
      const reel = e.target.closest(".reel");
      const reelId = reel.dataset.reelId;

      await fetch(`/user/${reelId}/like`, {
        method: "POST"
      });

      e.target.style.color = "red";
    }

    // SAVE
    if (e.target.classList.contains("save-btn")) {
      const reel = e.target.closest(".reel");
      const reelId = reel.dataset.reelId;

      await fetch(`/user/${reelId}/save`, {
        method: "POST"
      });

      e.target.textContent = "✅";
    }

  });

