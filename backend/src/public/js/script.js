
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
    videos.forEach(video => video.muted = true);

    // Intersection Observer for handling video play/pause on scroll
    const options = {
        root: null,  // viewport
        rootMargin: "0px",
        threshold: 0.6  // 60% visible to start video
    };

    const handleIntersect = (entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Play the video
                video.play().catch(err => console.log("Autoplay blocked:", err));
                // Unmute the active video
                video.muted = false;

                // Add tap-to-toggle audio
                video.addEventListener("click", toggleMute);
            } else {
                // Pause video and mute it
                video.pause();
                video.muted = true;

                // Remove tap-to-toggle audio
                video.removeEventListener("click", toggleMute);
            }
        });
    };

    const toggleMute = (event) => {
        const video = event.target;
        video.muted = !video.muted;  // toggle mute/unmute
    };

    const observer = new IntersectionObserver(handleIntersect, options);

    // Observe each video
    videos.forEach(video => observer.observe(video));

    // Scroll debounce logic to smooth out video skipping on scroll
    let isScrolling = false;
    let scrollTimeout;

    const debounceScroll = () => {
        if (isScrolling) return;

        isScrolling = true;

        // After a delay (to let scrolling finish), start the scroll event
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 100);  // adjust timeout as needed for smoothness
    };

    // Add scroll listener with debounce
    document.querySelector('.reels-container').addEventListener('scroll', debounceScroll);
});

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


