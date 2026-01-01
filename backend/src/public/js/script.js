
  document.addEventListener("click", async (e) => {

    // LIKE
    const likeBtn = e.target.closest(".like-btn");
    if (likeBtn) {
        const reel = likeBtn.closest(".reel");
        const reelId = reel.dataset.reelId;

        try {
            await fetch(`/user/${reelId}/like`, { method: "POST" });

            // Toggle active class for visual feedback
            likeBtn.classList.toggle("active");
        } catch (err) {
            console.error("Like error:", err);
        }
    }

    // SAVE
    const saveBtn = e.target.closest(".save-btn");
    if (saveBtn) {
        const reel = saveBtn.closest(".reel");
        const reelId = reel.dataset.reelId;

        try {
            await fetch(`/user/${reelId}/save`, { method: "POST" });

            // Toggle active class or icon for visual feedback
            saveBtn.classList.toggle("active");
        } catch (err) {
            console.error("Save error:", err);
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll(".reel video");

  // Mute all videos initially
  videos.forEach(video => {
    video.muted = true;

    let tapCount = 0;
    let tapTimer = null;

    // SINGLE TAP = Play / Pause
    // DOUBLE TAP = Mute / Unmute
    video.addEventListener("click", () => {
      tapCount++;
      if (tapCount === 1) {
  tapTimer = setTimeout(() => {
    if (video.paused) {
      video.play().catch(() => {});
      showFeedback(video, "▶️"); // play
    } else {
      video.pause();
      showFeedback(video, "⏸️"); // pause
    }
    tapCount = 0;
  }, 250);
}

if (tapCount === 2) {
  clearTimeout(tapTimer);
  video.muted = !video.muted;
  showFeedback(video, video.muted ? "🔇" : "🔊");
  tapCount = 0;
}

    });
  });

  // Intersection Observer for autoplay on scroll
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.6
  };

  const handleIntersect = (entries) => {
    entries.forEach(entry => {
      const video = entry.target;

      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  };

  const observer = new IntersectionObserver(handleIntersect, options);

  videos.forEach(video => observer.observe(video));

  // Optional scroll debounce (kept from your code)
  let isScrolling = false;

  const debounceScroll = () => {
    if (isScrolling) return;
    isScrolling = true;

    setTimeout(() => {
      isScrolling = false;
    }, 100);
  };

  document
    .querySelector(".reels-container")
    ?.addEventListener("scroll", debounceScroll);
});
function showFeedback(video, text) {
  let feedback = video.parentElement.querySelector(".video-feedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.className = "video-feedback";
    video.parentElement.appendChild(feedback);
  }
  feedback.textContent = text;
  feedback.classList.add("show");

  setTimeout(() => {
    feedback.classList.remove("show");
  }, 700); // visible for 0.7s
}



/* for the === comments only === */

function loadComments(reelId, reel) {
  fetch(`/user/comments/${reelId}`)
    .then(res => res.json())
    .then(comments => {
      const list = reel.querySelector(".comment-list");
      list.innerHTML = "";

      comments.forEach(c => {
        const div = document.createElement("div");
        div.innerHTML = `<strong>@${c.name}</strong><br>${c.comment}`;
        list.appendChild(div);
      });
    });
}
document.querySelectorAll(".comment-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const reel = btn.closest(".reel");
    reel.classList.add("show-comments");

    const reelId = reel.dataset.reelId;
    loadComments(reelId, reel);
  });
});
document.querySelectorAll(".close-comment").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest(".reel").classList.remove("show-comments");
  });
});

document.querySelectorAll(".comment-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const reel = btn.closest(".reel");
    const container = document.querySelector(".reels-container");

    // Show comments
    reel.classList.add("show-comments");

    // LOCK REEL SCROLL
    container.classList.add("lock-scroll");

    // Fetch comments
    const reelId = reel.dataset.reelId;
    loadComments(reelId, reel);
  });
});
document.querySelectorAll(".close-comment").forEach(btn => {
  btn.addEventListener("click", () => {
    const reel = btn.closest(".reel");
    const container = document.querySelector(".reels-container");

    // Hide comments
    reel.classList.remove("show-comments");

    // UNLOCK REEL SCROLL
    container.classList.remove("lock-scroll");
  });
});

document.querySelector(".reels-container").addEventListener(
  "touchmove",
  (e) => {
    if (document.querySelector(".reel.show-comments")) {
      e.preventDefault();
    }
  },
  { passive: false }
);
// Handle comment form submit
document.querySelectorAll(".comment-form").forEach(form => {
  form.addEventListener("submit", e => {
    e.preventDefault(); // Prevent page reload

    const reel = form.closest(".reel");
    const reelId = reel.dataset.reelId;
    const input = form.querySelector("input");
    const comment = input.value.trim();

    if (!comment) return; // Do nothing if empty

    fetch(`/user/${reelId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ comment })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === "comment is added") {
        input.value = ""; // clear input
        loadComments(reelId, reel); // refresh comments
      } else {
        alert("Failed to post comment");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Server error");
    });
  });
});


