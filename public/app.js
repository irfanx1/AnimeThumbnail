document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Editor Panel
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const searchResults = document.getElementById('search-results');
  
  const inputTitle = document.getElementById('input-title');
  const inputTitleSize = document.getElementById('input-title-size');
  const inputTitleColor = document.getElementById('input-title-color');
  
  const inputTopTag = document.getElementById('input-top-tag');
  const inputGenres = document.getElementById('input-genres');
  const inputDescription = document.getElementById('input-description');
  
  const inputStudio = document.getElementById('input-studio');
  const inputEpisodes = document.getElementById('input-episodes');
  const inputReleased = document.getElementById('input-released');
  const inputFormat = document.getElementById('input-format');
  const inputScore = document.getElementById('input-score');
  
  const uploadPoster = document.getElementById('upload-poster');
  const uploadBackground = document.getElementById('upload-background');
  const uploadRec1 = document.getElementById('upload-rec-1');
  const uploadRec2 = document.getElementById('upload-rec-2');
  const uploadRec3 = document.getElementById('upload-rec-3');
  const inputBottomBtnText = document.getElementById('input-bottom-btn-text');
  
  const inputBgBlur = document.getElementById('input-bg-blur');
  const inputBgDarkness = document.getElementById('input-bg-darkness');
  const inputShowAccents = document.getElementById('input-show-accents');
  const inputBgPosition = document.getElementById('input-bg-position');
  
  const tagPresets = document.querySelectorAll('.btn-preset');
  const exportScale = document.getElementById('export-scale');
  const downloadBtn = document.getElementById('download-btn');
  const btnTemplates = document.querySelectorAll('.btn-template');
  
  // Template 3 specific inputs
  const inputT3VerticalJapanese = document.getElementById('input-t3-vertical-japanese');
  const inputT3VerticalBlue = document.getElementById('input-t3-vertical-blue');
  const inputT3VerticalEnglish = document.getElementById('input-t3-vertical-english');
  const inputT3Tagline = document.getElementById('input-t3-tagline');

  // DOM Elements - Preview Panel
  const thumbPreview = document.getElementById('thumbnail-preview');
  const thumbBg = document.getElementById('thumb-bg');
  const thumbTopTag = document.getElementById('thumb-top-tag');
  const thumbTitle = document.getElementById('thumb-title');
  const thumbGenres = document.getElementById('thumb-genres');
  const thumbGenresT2 = document.getElementById('thumb-genres-t2');
  const thumbDescription = document.getElementById('thumb-description');
  
  const thumbStatStudio = document.getElementById('thumb-stat-studio');
  const thumbStatEpisodes = document.getElementById('thumb-stat-episodes');
  const thumbStatReleased = document.getElementById('thumb-stat-released');
  const thumbStatFormat = document.getElementById('thumb-stat-format');
  const thumbStatScore = document.getElementById('thumb-stat-score');
  
  const thumbPoster = document.getElementById('thumb-poster');
  const posterAccents = document.querySelectorAll('.poster-accent');
  
  const thumbRec1 = document.getElementById('thumb-rec-1');
  const thumbRec2 = document.getElementById('thumb-rec-2');
  const thumbRec3 = document.getElementById('thumb-rec-3');
  const thumbBottomBtnText = document.getElementById('thumb-bottom-btn-text');

  // Template 3 specific outputs
  const thumbT3VerticalJapanese = document.getElementById('thumb-t3-vertical-japanese');
  const thumbT3VerticalBlue = document.getElementById('thumb-t3-vertical-blue');
  const thumbT3VerticalEnglish = document.getElementById('thumb-t3-vertical-english');
  const thumbT3Tagline = document.getElementById('thumb-t3-tagline');
  const thumbTitleT3 = document.getElementById('thumb-title-t3');
  const thumbDescT3 = document.getElementById('thumb-desc-t3');
  const thumbDescLeftT3 = document.getElementById('thumb-desc-left-t3');
  
  const thumbRecT31 = document.getElementById('thumb-rec-t3-1');
  const thumbRecT32 = document.getElementById('thumb-rec-t3-2');
  const thumbRecT33 = document.getElementById('thumb-rec-t3-3');

  // State Management
  let selectedTagStyle = 'colorful'; // colorful, white, accent
  let currentPosterSrc = '';
  let currentLoadedImage = null;
  let currentTemplate = 1; // 1, 2, or 3
  let recImages = ['', '', ''];

  // Initialize Default Layout (Solo Leveling)
  const defaultPosterUrl = 'https://cdn.myanimelist.net/images/anime/1487/140027.jpg';
  setPosterAndBackground(defaultPosterUrl);
  
  // Set default body template class
  document.body.className = 'app-template-1';

  // 1. Dynamic scale calculator for the 1280x720 canvas
  function resizePreview() {
    const container = document.querySelector('.thumbnail-export-container');
    const scale = container.offsetWidth / 1280;
    thumbPreview.style.setProperty('--thumb-scale', scale);
  }
  
  window.addEventListener('resize', resizePreview);
  resizePreview(); // initial call
  setTimeout(resizePreview, 100); // safety buffer for styling loads

  // Standard Genre Colors (HSL/Hex) for the colorful preset
  const genreColorMap = {
    'ACTION': { text: '#ff5a5f', border: 'rgba(255, 90, 95, 0.6)' },
    'DRAMA': { text: '#3f8efc', border: 'rgba(63, 142, 252, 0.6)' },
    'HORROR': { text: '#2ec4b6', border: 'rgba(46, 196, 182, 0.6)' },
    'ROMANCE': { text: '#ff70a6', border: 'rgba(255, 112, 166, 0.6)' },
    'FANTASY': { text: '#ffbe0b', border: 'rgba(255, 190, 11, 0.6)' },
    'ADVENTURE': { text: '#8338ec', border: 'rgba(131, 56, 236, 0.6)' },
    'COMEDY': { text: '#06d6a0', border: 'rgba(6, 214, 160, 0.6)' },
    'MYSTERY': { text: '#b5e2fa', border: 'rgba(181, 226, 250, 0.6)' },
    'SCI-FI': { text: '#00f5d4', border: 'rgba(0, 245, 212, 0.6)' },
    'SUSPENSE': { text: '#e63946', border: 'rgba(230, 57, 70, 0.6)' },
    'SLICE OF LIFE': { text: '#e9c46a', border: 'rgba(233, 196, 106, 0.6)' },
    'SPORTS': { text: '#f4a261', border: 'rgba(244, 162, 97, 0.6)' },
    'SUPERNATURAL': { text: '#a2d2ff', border: 'rgba(162, 210, 255, 0.6)' }
  };

  const defaultColors = [
    { text: '#ff70a6', border: 'rgba(255, 112, 166, 0.6)' },
    { text: '#3f8efc', border: 'rgba(63, 142, 252, 0.6)' },
    { text: '#00f5d4', border: 'rgba(0, 245, 212, 0.6)' },
    { text: '#ffbe0b', border: 'rgba(255, 190, 11, 0.6)' }
  ];

  // 2. Synchronize all fields from inputs to card preview
  function updatePreview() {
    // Title, Size, Color
    thumbTitle.textContent = inputTitle.value.toUpperCase();
    thumbTitle.style.fontSize = `${inputTitleSize.value}rem`;
    thumbTitle.style.color = inputTitleColor.value;
    
    // Top tag
    thumbTopTag.textContent = inputTopTag.value;
    
    // Synopsis Description
    thumbDescription.textContent = inputDescription.value;
    
    // Stats grid
    thumbStatStudio.textContent = inputStudio.value.toUpperCase();
    thumbStatEpisodes.textContent = inputEpisodes.value.toUpperCase();
    thumbStatReleased.textContent = inputReleased.value.toUpperCase();
    thumbStatFormat.textContent = inputFormat.value.toUpperCase();
    thumbStatScore.textContent = inputScore.value.toUpperCase();
    
    // Bottom button (Template 2)
    if (thumbBottomBtnText && inputBottomBtnText) {
      thumbBottomBtnText.textContent = inputBottomBtnText.value.toUpperCase();
    }
    
    // Template 3 Overlays
    if (thumbT3VerticalJapanese && inputT3VerticalJapanese) {
      thumbT3VerticalJapanese.textContent = inputT3VerticalJapanese.value;
      thumbT3VerticalBlue.textContent = inputT3VerticalBlue.value;
      thumbT3VerticalEnglish.textContent = inputT3VerticalEnglish.value.toUpperCase();
      thumbT3Tagline.textContent = inputT3Tagline.value.toUpperCase();
      thumbTitleT3.textContent = inputTitle.value.toUpperCase() + (inputTitle.value.endsWith('.') ? '' : '.');
      thumbTitleT3.style.fontSize = `${inputTitleSize.value}rem`;
      thumbTitleT3.style.color = '#000000'; // Keep black on white right panel for contrast
      thumbDescT3.textContent = inputDescription.value;
      thumbDescLeftT3.textContent = inputDescription.value;

      // Dynamic blue title font size scaling for long English words
      const blueText = inputT3VerticalBlue.value || '';
      const isEnglish = /[a-zA-Z]/.test(blueText);
      if (isEnglish) {
        if (blueText.length > 10) {
          thumbT3VerticalBlue.style.fontSize = '24px';
          thumbT3VerticalBlue.style.letterSpacing = '2px';
        } else if (blueText.length > 5) {
          thumbT3VerticalBlue.style.fontSize = '36px';
          thumbT3VerticalBlue.style.letterSpacing = '4px';
        } else {
          thumbT3VerticalBlue.style.fontSize = '50px';
          thumbT3VerticalBlue.style.letterSpacing = '6px';
        }
      } else {
        // Japanese
        thumbT3VerticalBlue.style.fontSize = '80px';
        thumbT3VerticalBlue.style.letterSpacing = '0px';
      }
    }
    
    // Re-draw canvas-blurred background
    updateBackground();
    
    // Corner Accents
    posterAccents.forEach(accent => {
      if (inputShowAccents.checked) {
        accent.classList.remove('hidden');
      } else {
        accent.classList.add('hidden');
      }
    });

    // Render Genres
    renderGenresList();
  }

  // Genre Renderer helper
  function renderGenresList() {
    thumbGenres.innerHTML = '';
    thumbGenresT2.innerHTML = '';
    
    const genres = inputGenres.value.split(',').map(g => g.trim().toUpperCase()).filter(g => g.length > 0);
    
    genres.forEach((genre, index) => {
      // Card 1 Genre Badges
      const span1 = document.createElement('span');
      span1.className = 'genre-tag';
      span1.textContent = genre;
      
      if (selectedTagStyle === 'colorful') {
        const colorSet = genreColorMap[genre] || defaultColors[index % defaultColors.length];
        span1.style.color = colorSet.text;
        span1.style.borderColor = colorSet.border;
      } else if (selectedTagStyle === 'white') {
        span1.style.color = '#ffffff';
        span1.style.borderColor = 'rgba(255, 255, 255, 0.6)';
      } else if (selectedTagStyle === 'accent') {
        span1.style.color = 'var(--accent-color)';
        span1.style.borderColor = 'var(--accent-glow)';
      }
      
      thumbGenres.appendChild(span1);

      // Card 2 Genre Badges (Solid white background with black text, matches reference)
      const span2 = document.createElement('span');
      span2.className = 'genre-tag';
      span2.textContent = genre;
      
      thumbGenresT2.appendChild(span2);
    });
  }

  // Helper to request proxy URL for images to pass CORS
  function getProxyUrl(url) {
    if (!url) return '';
    if (url.startsWith('data:')) return url; // base64 is already local
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }

  // Helper to pre-render blurred/darkened or clean background on canvas
  // exportScaleFactor is the resolution multiplier (1, 2, or 3) used during PNG generation
  function updateBackground(exportScaleFactor = null) {
    if (!currentLoadedImage) {
      thumbBg.style.backgroundImage = 'linear-gradient(135deg, #0f121c 0%, #050608 100%)';
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const scale = exportScaleFactor || 1;

    if (currentTemplate === 3) {
      // Template 3: Left portrait panel (589x720 at 1x)
      canvas.width = 589 * scale;
      canvas.height = 720 * scale;
      ctx.filter = 'none';
    } else if (currentTemplate === 2) {
      // Template 2: Full landscape backdrop (1280x720 at 1x)
      canvas.width = 1280 * scale;
      canvas.height = 720 * scale;
      ctx.filter = 'none';
    } else {
      // Template 1: Full landscape backdrop
      const rawBlur = parseFloat(inputBgBlur.value);
      const darkness = 1 - (parseFloat(inputBgDarkness.value) / 100);
      
      if (exportScaleFactor) {
        // High quality export resolution
        canvas.width = 1280 * scale;
        canvas.height = 720 * scale;
        const canvasBlur = rawBlur * scale;
        ctx.filter = `blur(${canvasBlur}px) brightness(${darkness})`;
      } else {
        // Live preview resolution
        if (rawBlur === 0) {
          canvas.width = 1280;
          canvas.height = 720;
          ctx.filter = `brightness(${darkness})`;
        } else {
          // Low-res canvas for fast real-time blur updates during input typing
          canvas.width = 320;
          canvas.height = 180;
          const canvasBlur = (rawBlur / 40) * 8;
          ctx.filter = `blur(${canvasBlur}px) brightness(${darkness})`;
        }
      }
    }

    // Crop image with custom alignment
    const imgRatio = currentLoadedImage.width / currentLoadedImage.height;
    const canvasRatio = canvas.width / canvas.height;
    let sx, sy, sw, sh;
    
    const bgPosition = inputBgPosition.value;

    if (imgRatio > canvasRatio) {
      // Image is wider than canvas ratio - crop horizontally
      sh = currentLoadedImage.height;
      sw = currentLoadedImage.height * canvasRatio;
      sy = 0;
      
      if (bgPosition === 'right') {
        sx = currentLoadedImage.width - sw;
      } else if (bgPosition === 'left') {
        sx = 0;
      } else {
        sx = (currentLoadedImage.width - sw) / 2; // center
      }
    } else {
      // Image is taller than canvas ratio - crop vertically
      sw = currentLoadedImage.width;
      sh = currentLoadedImage.width / canvasRatio;
      sx = 0;
      
      if (bgPosition === 'right') {
        sy = currentLoadedImage.height - sh; // align bottom
      } else if (bgPosition === 'left') {
        sy = 0; // align top
      } else {
        sy = (currentLoadedImage.height - sh) / 2; // center
      }
    }

    ctx.drawImage(currentLoadedImage, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    try {
      const blurredDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      thumbBg.style.backgroundImage = `url('${blurredDataUrl}')`;
    } catch (e) {
      console.error('Error exporting background image:', e);
      thumbBg.style.backgroundImage = `url('${currentLoadedImage.src}')`;
    }
  }

  // Set poster & background image paths
  function setPosterAndBackground(url) {
    const proxied = getProxyUrl(url);
    currentPosterSrc = url;
    
    // Set poster source
    thumbPoster.src = proxied;
    
    // Load image for background canvas rendering
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      currentLoadedImage = img;
      updateBackground();
    };
    img.onerror = () => {
      currentLoadedImage = null;
      updateBackground();
    };
    img.src = proxied;
  }

  // 3. Register Event Listeners for Editor Controls
  const liveInputs = [
    inputTitle, inputTitleSize, inputTitleColor, inputTopTag, 
    inputGenres, inputDescription, inputStudio, inputEpisodes, 
    inputReleased, inputFormat, inputScore, inputBgBlur, 
    inputBgDarkness, inputShowAccents, inputBottomBtnText, inputBgPosition,
    inputT3VerticalJapanese, inputT3VerticalBlue, inputT3VerticalEnglish, inputT3Tagline
  ];
  
  liveInputs.forEach(input => {
    if (input) {
      input.addEventListener('input', updatePreview);
    }
  });

  // Checkbox requires change event
  inputShowAccents.addEventListener('change', updatePreview);

  // Template Toggling handler
  btnTemplates.forEach(btn => {
    btn.addEventListener('click', () => {
      btnTemplates.forEach(b => {
        b.classList.remove('active');
        b.style.color = 'var(--text-muted)';
      });
      btn.classList.add('active');
      btn.style.color = 'var(--text-main)';
      
      currentTemplate = parseInt(btn.getAttribute('data-template'), 10);
      
      // Select best default background positioning
      if (currentTemplate === 3) {
        inputBgPosition.value = 'left';
      } else if (currentTemplate === 2) {
        inputBgPosition.value = 'right';
      } else {
        inputBgPosition.value = 'center';
      }
      
      // Toggle template class on body & preview card
      document.body.className = `app-template-${currentTemplate}`;
      thumbPreview.className = `thumbnail-card template-${currentTemplate}`;
      
      // Update sizes and backgrounds
      resizePreview();
      updateBackground();
      updatePreview();
    });
  });

  // Genre style preset toggle
  tagPresets.forEach(btn => {
    btn.addEventListener('click', () => {
      tagPresets.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTagStyle = btn.getAttribute('data-style');
      renderGenresList();
    });
  });

  // Custom File Poster Upload Handler
  uploadPoster.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPosterAndBackground(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  // Custom File Background Upload Handler
  uploadBackground.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgData = event.target.result;
        const img = new Image();
        img.onload = () => {
          currentLoadedImage = img;
          updateBackground();
        };
        img.src = imgData;
      };
      reader.readAsDataURL(file);
    }
  });

  // Custom Recommendation Cards Upload Handlers
  [uploadRec1, uploadRec2, uploadRec3].forEach((uploader, index) => {
    uploader.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgData = event.target.result;
          recImages[index] = imgData;
          document.getElementById(`thumb-rec-${index+1}`).src = imgData;
          document.getElementById(`thumb-rec-t3-${index+1}`).src = imgData;
        };
        reader.readAsDataURL(file);
      }
    });
  });

  // 4. Jikan API (MyAnimeList) Search Functionality
  async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';
    searchResults.classList.add('hidden');
    searchResults.innerHTML = '';

    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5`);
      const responseData = await res.json();
      const results = responseData.data || [];

      if (results.length === 0) {
        searchResults.innerHTML = '<div class="result-item" style="cursor: default;">No results found</div>';
        searchResults.classList.remove('hidden');
        return;
      }

      results.forEach(anime => {
        const item = document.createElement('div');
        item.className = 'result-item';
        
        const title = anime.title_english || anime.title;
        const year = anime.year || (anime.aired && anime.aired.prop && anime.aired.prop.from && anime.aired.prop.from.year) || 'N/A';
        const type = anime.type || 'TV';
        const imgUrl = anime.images && anime.images.jpg && anime.images.jpg.image_url;

        item.innerHTML = `
          <img class="result-poster-thumb" src="${imgUrl || ''}" alt="poster">
          <div class="result-details">
            <span class="result-title">${title}</span>
            <span class="result-meta">${type} • ${year}</span>
          </div>
        `;

        item.addEventListener('click', () => {
          selectAnime(anime);
          searchResults.classList.add('hidden');
        });

        searchResults.appendChild(item);
      });

      searchResults.classList.remove('hidden');
    } catch (err) {
      console.error('Anime search failed:', err);
      searchResults.innerHTML = '<div class="result-item" style="cursor: default; color: #ff5a5f;">Error searching anime</div>';
      searchResults.classList.remove('hidden');
    } finally {
      searchBtn.disabled = false;
      searchBtn.textContent = 'Search';
    }
  }

  // Bind Search triggers
  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  // Close search dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box') && !e.target.closest('#search-results')) {
      searchResults.classList.add('hidden');
    }
  });

  // Populate editor form with selected Anime data
  async function selectAnime(anime) {
    // English Title fallback to Japanese/Romaji
    inputTitle.value = (anime.title_english || anime.title).toUpperCase();
    
    // Synopsis (strip out extra tags or bracket info typical of MAL descriptions, e.g. [Written by MAL Rewrite])
    let synopsis = anime.synopsis || '';
    synopsis = synopsis.replace(/\[Written by MAL Rewrite\]/g, '').trim();
    inputDescription.value = synopsis;
    
    // Genres mapping
    if (anime.genres && anime.genres.length > 0) {
      inputGenres.value = anime.genres.map(g => g.name).join(', ');
    } else {
      inputGenres.value = '';
    }

    // Stats
    const studioObj = anime.studios && anime.studios[0];
    inputStudio.value = studioObj ? studioObj.name.toUpperCase() : 'N/A';
    inputEpisodes.value = anime.episodes ? anime.episodes.toString() : 'N/A';
    
    const year = anime.year || (anime.aired && anime.aired.prop && anime.aired.prop.from && anime.aired.prop.from.year);
    inputReleased.value = year ? year.toString() : 'N/A';
    
    inputFormat.value = (anime.type || 'TV').toUpperCase();
    
    // Score mapping to % format
    if (anime.score) {
      const percentage = Math.round(anime.score * 10);
      inputScore.value = `${percentage}%`;
    } else {
      inputScore.value = 'N/A';
    }

    // Set poster URL
    const imageToLoad = anime.images && anime.images.jpg && (anime.images.jpg.large_image_url || anime.images.jpg.image_url);
    if (imageToLoad) {
      setPosterAndBackground(imageToLoad);
    }

    // Set Template 3 overlays
    if (inputT3VerticalJapanese) {
      // Clean up romaji / English title for Japanese vertical tag
      inputT3VerticalJapanese.value = anime.title || '';
      inputT3VerticalBlue.value = anime.title_japanese || anime.title || '';
      inputT3VerticalEnglish.value = (anime.title_english || anime.title || '').toUpperCase();
    }

    // Trigger full preview redraw
    updatePreview();

    // Fetch Recommendations for Template 2 card grids (MAL ID query)
    if (anime.mal_id) {
      try {
        const recRes = await fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}/recommendations`);
        const recData = await recRes.json();
        const recs = recData.data || [];
        
        for (let i = 0; i < 3; i++) {
          if (recs[i] && recs[i].entry) {
            const recImg = recs[i].entry.images.jpg.large_image_url || recs[i].entry.images.jpg.image_url;
            recImages[i] = recImg;
            document.getElementById(`thumb-rec-${i+1}`).src = getProxyUrl(recImg);
            document.getElementById(`thumb-rec-t3-${i+1}`).src = getProxyUrl(recImg);
          } else {
            // Fallback: use main poster if recommendations are empty
            recImages[i] = imageToLoad || '';
            document.getElementById(`thumb-rec-${i+1}`).src = getProxyUrl(imageToLoad);
            document.getElementById(`thumb-rec-t3-${i+1}`).src = getProxyUrl(imageToLoad);
          }
        }
      } catch (err) {
        console.error('Failed to load anime recommendations:', err);
        // Fallback for all 3 cards
        for (let i = 1; i <= 3; i++) {
          document.getElementById(`thumb-rec-${i}`).src = getProxyUrl(imageToLoad);
          document.getElementById(`thumb-rec-t3-${i}`).src = getProxyUrl(imageToLoad);
        }
      }
    }
  }

  // 5. html2canvas Download operation using clean offscreen cloning (fixes transform blur & crop issues)
  downloadBtn.addEventListener('click', () => {
    // Modify text content of button for UI feedback
    const originalText = downloadBtn.innerHTML;
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '<span class="btn-icon">⏳</span> Generating PNG...';

    // Get Scale Factor selected
    const scale = parseInt(exportScale.value, 10) || 2;

    // Render high resolution background specifically for high-quality export
    updateBackground(scale);

    // Create a clone of the preview card for clean export (avoids transform browser bugs)
    const clone = thumbPreview.cloneNode(true);
    
    // Style the clone offscreen but fully visible to html2canvas without any transforms
    clone.style.position = 'fixed';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.width = '1280px';
    clone.style.height = '720px';
    clone.style.transform = 'none';
    clone.style.zIndex = '-9999';
    clone.style.margin = '0';
    clone.style.padding = '0';
    clone.style.setProperty('--thumb-scale', '1');
    
    // Append to body so html2canvas can find and render it
    document.body.appendChild(clone);

    // html2canvas configurations
    const options = {
      useCORS: true,
      allowTaint: false,
      scale: scale,
      logging: false,
      backgroundColor: null,
      width: 1280,
      height: 720
    };

    // Delay calculation by a short timeout to let the DOM clone settle
    setTimeout(() => {
      html2canvas(clone, options).then(canvas => {
        // Remove the clone from the DOM
        document.body.removeChild(clone);
        
        // Restore standard resolution background for live preview responsiveness
        updateBackground();
        
        try {
          // Convert canvas to image URL
          const link = document.createElement('a');
          const cleanName = inputTitle.value.toLowerCase().replace(/[^a-z0-9]+/g, '_');
          link.download = `${cleanName}_thumbnail.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        } catch (err) {
          console.error('Error generating image file:', err);
          alert('Could not export image. This is usually due to CORS constraints on images. Try uploading a custom poster instead!');
        }

        // Reset button
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = originalText;
      }).catch(err => {
        console.error('html2canvas render error:', err);
        alert('Thumbnail rendering failed. Please try again.');
        
        // Clean up clone
        if (clone.parentNode) {
          document.body.removeChild(clone);
        }
        
        // Restore standard resolution background for live preview responsiveness
        updateBackground();
        
        // Reset button
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = originalText;
      });
    }, 200);
  });

  // Fetch Default Show (Rent a Girlfriend, ID 40839, to showcase Template 2 nicely on start)
  const rentAGirlfriendId = 40839;
  fetch(`https://api.jikan.moe/v4/anime/${rentAGirlfriendId}`).then(res => res.json()).then(resData => {
    if (resData && resData.data) {
      selectAnime(resData.data);
    }
  }).catch(err => {
    console.error('Failed to load default anime:', err);
    // Fallback recommendation images
    for (let i = 1; i <= 3; i++) {
      document.getElementById(`thumb-rec-${i}`).src = getProxyUrl(defaultPosterUrl);
      document.getElementById(`thumb-rec-t3-${i}`).src = getProxyUrl(defaultPosterUrl);
    }
  });

  // Call initial preview sync
  updatePreview();
});
