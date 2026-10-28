document.addEventListener('DOMContentLoaded', () => {
    // Task 1: Contact form validation
    const contactForm = document.getElementById('contactForm');

    function showError(input, message) {
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        const error = input.nextElementSibling;
        if (error && error.classList.contains('invalid-feedback')) {
            error.textContent = message;
        }
    }

    function clearError(input) {
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        const error = input.nextElementSibling;
        if (error && error.classList.contains('invalid-feedback')) {
            error.textContent = '';
        }
    }

    if (contactForm) {
        const nameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('emailAddress');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const formStatus = document.getElementById('formStatus');
        const nextStepBtn = document.getElementById('contactNextBtn');
        const backStepBtn = document.getElementById('contactBackBtn');
        const formSteps = Array.from(contactForm.querySelectorAll('.form-step'));
        const fields = [nameInput, emailInput, passwordInput, confirmPasswordInput];
        let currentFormStep = 0;

        fields.forEach((field) => {
            if (field) field.addEventListener('input', () => clearError(field));
        });

        // Callback updates the visible step while keeping entered values in the form.
        function showFormStep(stepIndex) {
            currentFormStep = Math.max(0, Math.min(stepIndex, formSteps.length - 1));
            formSteps.forEach((step, index) => {
                const isActive = index === currentFormStep;
                step.classList.toggle('is-active', isActive);
                step.setAttribute('aria-hidden', String(!isActive));
            });

            if (formStatus) {
                formStatus.textContent = currentFormStep === 0
                    ? 'Step 1 of 2: Enter your name and email.'
                    : 'Step 2 of 2: Create and confirm your password.';
            }

            const firstInput = formSteps[currentFormStep]?.querySelector('input');
            if (firstInput) firstInput.focus();
        }

        function validatePersonalDetails() {
            [nameInput, emailInput].forEach((field) => { if (field) clearError(field); });
            let isValid = true;

            if (!nameInput.value.trim()) {
                showError(nameInput, 'Full name is required.');
                isValid = false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email address.');
                isValid = false;
            }

            if (!isValid) {
                const firstInvalid = contactForm.querySelector('.is-invalid');
                if (firstInvalid) firstInvalid.focus();
                if (formStatus) formStatus.textContent = 'Please correct the highlighted fields.';
            }
            return isValid;
        }

        if (nextStepBtn) {
            nextStepBtn.addEventListener('click', () => {
                if (validatePersonalDetails()) showFormStep(1);
            });
        }

        if (backStepBtn) {
            backStepBtn.addEventListener('click', () => showFormStep(0));
        }

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (currentFormStep === 0) {
                if (validatePersonalDetails()) showFormStep(1);
                return;
            }

            let isValid = true;
            fields.forEach((field) => { if (field) clearError(field); });
            if (formStatus) formStatus.textContent = '';

            if (!nameInput.value.trim()) {
                showError(nameInput, 'Full name is required.');
                isValid = false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email address.');
                isValid = false;
            }

            if (passwordInput.value.length < 6) {
                showError(passwordInput, 'Password must be at least 6 characters long.');
                isValid = false;
            }

            if (!confirmPasswordInput.value) {
                showError(confirmPasswordInput, 'Please confirm your password.');
                isValid = false;
            } else if (confirmPasswordInput.value !== passwordInput.value) {
                showError(confirmPasswordInput, 'Passwords do not match.');
                isValid = false;
            }

            if (!isValid) {
                const firstInvalid = contactForm.querySelector('.is-invalid');
                if (firstInvalid) {
                    const invalidStep = firstInvalid.closest('.form-step');
                    const stepIndex = formSteps.indexOf(invalidStep);
                    if (stepIndex >= 0) showFormStep(stepIndex);
                    firstInvalid.focus();
                }
                if (formStatus) formStatus.textContent = 'Please correct the highlighted fields.';
                return;
            }

            contactForm.reset();
            showFormStep(0);
            if (formStatus) formStatus.textContent = 'Form validated successfully. This demo does not send data to a server.';
        });
    }

    // Task 2: FAQ accordion with a smooth height transition.
    const accordionHeaders = document.querySelectorAll('.faq-question');
    accordionHeaders.forEach((header) => {
        const item = header.closest('.faq-item');
        const answer = item ? item.querySelector('.faq-answer') : null;
        if (!answer) return;

        answer.style.maxHeight = '0px';
        answer.style.overflow = 'hidden';
        answer.style.opacity = '0';
        answer.style.transition = 'max-height 300ms ease, opacity 300ms ease';
        answer.setAttribute('aria-hidden', 'true');

        header.addEventListener('click', () => {
            const shouldOpen = header.getAttribute('aria-expanded') !== 'true';

            accordionHeaders.forEach((otherHeader) => {
                const otherItem = otherHeader.closest('.faq-item');
                const otherAnswer = otherItem ? otherItem.querySelector('.faq-answer') : null;
                if (!otherAnswer) return;
                otherHeader.setAttribute('aria-expanded', 'false');
                otherAnswer.style.maxHeight = '0px';
                otherAnswer.style.opacity = '0';
                otherAnswer.setAttribute('aria-hidden', 'true');
            });

            if (shouldOpen) {
                header.setAttribute('aria-expanded', 'true');
                answer.setAttribute('aria-hidden', 'false');
                answer.style.maxHeight = `${answer.scrollHeight}px`;
                answer.style.opacity = '1';
            }
        });
    });

    // Task 3: Subscription modal. It closes via the close button, backdrop, or Escape.
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('subscriptionModal');
    const subscriptionForm = document.getElementById('subscriptionForm');
    const subscriptionEmail = document.getElementById('subscriptionEmail');
    const subscriptionStatus = document.getElementById('subscriptionStatus');
    let previouslyFocusedElement = null;

    function openModal() {
        if (!modalOverlay) return;
        previouslyFocusedElement = document.activeElement;
        modalOverlay.style.display = 'flex';
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        if (subscriptionEmail) subscriptionEmail.focus();
    }

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.style.display = 'none';
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
            previouslyFocusedElement.focus();
        }
    }

    if (openModalBtn && modalOverlay) openModalBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) closeModal();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modalOverlay.style.display === 'flex') closeModal();
        });
    }

    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!subscriptionForm.checkValidity()) {
                subscriptionForm.reportValidity();
                return;
            }
            if (subscriptionStatus) subscriptionStatus.textContent = 'Thank you! Your email passed validation. This demo does not save or send data.';
            subscriptionForm.reset();
        });
    }

    // Task 4: Cycle through predefined page background colors.
    const colorBtn = document.getElementById('changeBgBtn');
    const colors = ['#F7F5F0', '#EAE7DC', '#D8C3A5', '#E8A87C', '#C38D9E', '#E27D60'];
    let colorIndex = 0;
    if (colorBtn) {
        colorBtn.addEventListener('click', () => {
            colorIndex = (colorIndex + 1) % colors.length;
            document.body.style.setProperty('--page-background', colors[colorIndex]);
        });
    }

    // Task 5: Live date and time. Each page updates only if the display exists.
    const dateTimeElement = document.getElementById('dateTimeDisplay');
    if (dateTimeElement) {
        const formatter = new Intl.DateTimeFormat('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
        });
        const updateDateTime = () => {
            dateTimeElement.textContent = formatter.format(new Date());
        };
        updateDateTime();
        window.setInterval(updateDateTime, 1000);
    }


    // Assignment 5: shared theme switch using class-based styling.
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isNight = document.body.classList.toggle('night-theme');
            themeToggleBtn.textContent = isNight ? 'Switch to Day Mode' : 'Switch to Night Mode';
            themeToggleBtn.setAttribute('aria-pressed', String(isNight));
        });
    }

    // Assignment 5: shared audio controls. Only one supplied track may play at a time.
    const heritageAudio = document.getElementById('heritageAudio');
    const heritagePlayBtn = document.getElementById('heritagePlayBtn');
    const heritageStopBtn = document.getElementById('heritageStopBtn');
    const heritageTrackSelect = document.getElementById('heritageTrackSelect');
    const heritageAudioStatus = document.getElementById('heritageAudioStatus');

    const soundEffectBtn = document.getElementById('soundEffectBtn');
    let standaloneHeritageSound = null;
    if (soundEffectBtn) {
        standaloneHeritageSound = new Audio('audio/ki-shashu.mp3');
        standaloneHeritageSound.preload = 'auto';
        standaloneHeritageSound.volume = 0.75;

        soundEffectBtn.addEventListener('click', async () => {
            if (standaloneHeritageSound.paused) {
                try {
                    // Start from the beginning if the previous playback reached the end.
                    if (standaloneHeritageSound.ended) standaloneHeritageSound.currentTime = 0;
                    if (heritageAudio && !heritageAudio.paused) {
                        heritageAudio.pause();
                        if (heritagePlayBtn) heritagePlayBtn.textContent = 'Play Music';
                        if (heritageAudioStatus) heritageAudioStatus.textContent = 'Music paused to play heritage sound.';
                    }
                    await standaloneHeritageSound.play();
                    soundEffectBtn.textContent = 'Pause Heritage Sound';
                    soundEffectBtn.setAttribute('aria-pressed', 'true');
                } catch (error) {
                    soundEffectBtn.textContent = 'Sound unavailable — try again';
                    soundEffectBtn.setAttribute('aria-pressed', 'false');
                    console.error('Unable to play audio/ki-shashu.mp3:', error);
                }
            } else {
                standaloneHeritageSound.pause();
                soundEffectBtn.textContent = 'Play Heritage Sound';
                soundEffectBtn.setAttribute('aria-pressed', 'false');
            }
        });

        standaloneHeritageSound.addEventListener('ended', () => {
            soundEffectBtn.textContent = 'Play Heritage Sound';
            soundEffectBtn.setAttribute('aria-pressed', 'false');
        });
        standaloneHeritageSound.addEventListener('error', () => {
            soundEffectBtn.textContent = 'Sound unavailable — check audio file';
            soundEffectBtn.setAttribute('aria-pressed', 'false');
        });
    }

    // Assignment 5: keyboard navigation through visible navigation links.
    document.querySelectorAll('.navbar-nav').forEach((menu) => {
        const menuLinks = Array.from(menu.querySelectorAll('a.nav-link'));
        menu.addEventListener('keydown', (event) => {
            if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key) || menuLinks.length === 0) return;
            const currentIndex = menuLinks.indexOf(document.activeElement);
            if (currentIndex === -1) return;
            event.preventDefault();
            let nextIndex = currentIndex;
            switch (event.key) {
                case 'ArrowRight':
                    nextIndex = (currentIndex + 1) % menuLinks.length;
                    break;
                case 'ArrowLeft':
                    nextIndex = (currentIndex - 1 + menuLinks.length) % menuLinks.length;
                    break;
                case 'Home':
                    nextIndex = 0;
                    break;
                case 'End':
                    nextIndex = menuLinks.length - 1;
                    break;
            }
            menuLinks[nextIndex].focus();
        });
    });

    // Assignment 5: project data is stored as objects in an array.
    const heritageItems = [
        { title: 'Khoja Ahmed Yasawi Mausoleum', category: 'architecture', image: 'images/yasawi.jpg', description: 'A landmark of medieval architecture in Turkistan.' },
        { title: 'Kazakh Yurt', category: 'traditions', image: 'images/yurt.jpg', description: 'A portable dwelling designed for a nomadic way of life.' },
        { title: 'Tamgaly Petroglyphs', category: 'history', image: 'images/tamgaly.jpg', description: 'Rock carvings that preserve traces of ancient life.' },
        { title: 'Burabay', category: 'nature', image: 'images/burabay.jpg', description: 'A landscape known for its lakes, forests, and rock formations.' },
        { title: 'Kazakh Traditions', category: 'traditions', image: 'images/kazakh_culture.jpg', description: 'Cultural practices passed between generations.' },
        { title: 'Heritage Collection', category: 'history', image: 'images/jetiqazyna.jpg', description: 'A visual introduction to Kazakhstan’s cultural heritage.' },
        { title: 'Katon-Karagay', category: 'nature', image: 'images/extra/katon-karagay.jpg', description: 'Mountain landscapes, forests, and lakes of eastern Kazakhstan.' },
        { title: 'Charyn Canyon', category: 'nature', image: 'images/extra/sharyn-canyon.jpg', description: 'A dramatic canyon shaped by natural erosion.' },
        { title: 'Mangystau Landscapes', category: 'nature', image: 'images/extra/mangystau-steppe.jpg', description: 'Distinctive cliffs and open desert landscapes in western Kazakhstan.' },
        { title: 'Kazakh Girls in Traditional Dress', category: 'traditions', image: 'images/extra/qazaq-girls.jpg', description: 'Traditional clothing and cultural identity across generations.' },
        { title: 'Qobyz and Dombra', category: 'traditions', image: 'images/extra/qobyz-dombra.jpg', description: 'Traditional instruments associated with Kazakh musical heritage.' },
        { title: 'Toy Zhiyin Gathering', category: 'traditions', image: 'images/extra/toy-zhyin.jpg', description: 'A community gathering with traditional clothing and customs.' },
        { title: 'Aksak Kulan', category: 'history', image: 'images/extra/aksak-kulan-art.jpg', description: 'A visual reference to a well-known Kazakh musical legend.' },
        { title: 'Kazakh Warrior Heritage', category: 'history', image: 'images/extra/kazakh-warrior.jpg', description: 'A representation of historical steppe warrior traditions.' }
    ];

    const heritageFilter = document.getElementById('heritageFilter');
    const heritageResults = document.getElementById('heritageResults');
    const heritageResultStatus = document.getElementById('heritageResultStatus');

    function getHeritageCategoryLabel(category) {
        switch (category) {
            case 'architecture': return 'Architecture';
            case 'traditions': return 'Traditions';
            case 'history': return 'History';
            case 'nature': return 'Nature';
            default: return 'All categories';
        }
    }

    // The callback creates each card; filter() and forEach() process the array.
    function renderHeritageItems(items, createCard) {
        if (!heritageResults) return;
        heritageResults.replaceChildren();
        items.forEach(createCard);
        if (heritageResultStatus) {
            heritageResultStatus.textContent = `${items.length} heritage item${items.length === 1 ? '' : 's'} shown.`;
        }
    }

    function createHeritageCard(item) {
        const column = document.createElement('div');
        column.className = 'col';
        const card = document.createElement('article');
        card.className = 'card heritage-result-card shadow-sm border-0';
        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.title;
        image.loading = 'lazy';
        const body = document.createElement('div');
        body.className = 'card-body';
        const category = document.createElement('p');
        category.className = 'small text-primary text-uppercase fw-bold mb-2';
        category.textContent = getHeritageCategoryLabel(item.category);
        const title = document.createElement('h4');
        title.className = 'h5 card-title';
        title.textContent = item.title;
        const description = document.createElement('p');
        description.className = 'card-text text-muted mb-0';
        description.textContent = item.description;
        body.append(category, title, description);
        card.append(image, body);
        column.append(card);
        heritageResults.append(column);
    }

    function updateHeritageFilter() {
        if (!heritageFilter || !heritageResults) return;
        const selectedCategory = heritageFilter.value;
        // switch statement makes the selected category explicit and easy to explain.
        let filteredItems;
        switch (selectedCategory) {
            case 'architecture':
                filteredItems = heritageItems.filter((item) => item.category === 'architecture');
                break;
            case 'traditions':
                filteredItems = heritageItems.filter((item) => item.category === 'traditions');
                break;
            case 'history':
                filteredItems = heritageItems.filter((item) => item.category === 'history');
                break;
            case 'nature':
                filteredItems = heritageItems.filter((item) => item.category === 'nature');
                break;
            default:
                filteredItems = heritageItems;
        }
        renderHeritageItems(filteredItems, createHeritageCard);
    }

    if (heritageFilter && heritageResults) {
        heritageFilter.addEventListener('change', updateHeritageFilter);
        updateHeritageFilter();
    }

    // Assignment 5: thumbnail clicks change the larger image's src and caption.
    const featuredHeritageImage = document.getElementById('featuredHeritageImage');
    const featuredHeritageCaption = document.getElementById('featuredHeritageCaption');
    const imageExplorerStatus = document.getElementById('imageExplorerStatus');
    const heritageThumbnails = Array.from(document.querySelectorAll('.heritage-thumbnail'));

    function selectHeritageThumbnail(button) {
        if (!featuredHeritageImage || !button) return;
        featuredHeritageImage.classList.add('image-changing');
        const imagePath = button.dataset.image;
        const caption = button.dataset.caption;
        featuredHeritageImage.src = imagePath;
        featuredHeritageImage.alt = caption;
        if (featuredHeritageCaption) featuredHeritageCaption.textContent = caption;
        if (imageExplorerStatus) imageExplorerStatus.textContent = `Showing ${caption}.`;
        heritageThumbnails.forEach((thumbnail) => {
            const isSelected = thumbnail === button;
            thumbnail.classList.toggle('is-selected', isSelected);
            thumbnail.setAttribute('aria-pressed', String(isSelected));
        });
        window.setTimeout(() => featuredHeritageImage.classList.remove('image-changing'), 180);
    }

    heritageThumbnails.forEach((button, index) => {
        button.addEventListener('click', () => selectHeritageThumbnail(button));
        button.addEventListener('keydown', (event) => {
            let nextIndex = index;
            if (event.key === 'ArrowRight') nextIndex = (index + 1) % heritageThumbnails.length;
            else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + heritageThumbnails.length) % heritageThumbnails.length;
            else return;
            event.preventDefault();
            heritageThumbnails[nextIndex].focus();
            selectHeritageThumbnail(heritageThumbnails[nextIndex]);
        });
    });


    // Assignment 5: user-controlled cultural audio player (no autoplay).
    function updateAudioStatus(message) {
        if (heritageAudioStatus) heritageAudioStatus.textContent = message;
    }

    if (heritageAudio && heritageTrackSelect && heritagePlayBtn && heritageStopBtn) {
        function loadSelectedTrack(shouldPlay = false) {
            const selectedTrack = heritageTrackSelect.options[heritageTrackSelect.selectedIndex];
            const trackName = selectedTrack ? selectedTrack.textContent : 'Cultural audio';
            if (heritageAudio.src !== new URL(heritageTrackSelect.value, document.baseURI).href) {
                heritageAudio.src = heritageTrackSelect.value;
            }
            if (shouldPlay) {
                if (standaloneHeritageSound && !standaloneHeritageSound.paused) {
                    standaloneHeritageSound.pause();
                    if (soundEffectBtn) {
                        soundEffectBtn.textContent = 'Play Heritage Sound';
                        soundEffectBtn.setAttribute('aria-pressed', 'false');
                    }
                }
                heritageAudio.play().then(() => {
                    heritagePlayBtn.textContent = 'Pause Music';
                    updateAudioStatus(`Playing: ${trackName}`);
                }).catch(() => {
                    updateAudioStatus('Playback could not start. Press Play Music again.');
                });
            } else {
                updateAudioStatus(`Selected: ${trackName}`);
            }
        }

        heritageTrackSelect.addEventListener('change', () => {
            heritageAudio.pause();
            heritageAudio.currentTime = 0;
            heritagePlayBtn.textContent = 'Play Music';
            loadSelectedTrack(false);
        });

        heritagePlayBtn.addEventListener('click', () => {
            if (heritageAudio.paused) {
                loadSelectedTrack(true);
            } else {
                heritageAudio.pause();
                heritagePlayBtn.textContent = 'Play Music';
                updateAudioStatus('Music paused.');
            }
        });

        heritageStopBtn.addEventListener('click', () => {
            heritageAudio.pause();
            heritageAudio.currentTime = 0;
            heritagePlayBtn.textContent = 'Play Music';
            updateAudioStatus('Music stopped.');
        });

        heritageAudio.addEventListener('ended', () => {
            heritagePlayBtn.textContent = 'Play Music';
            updateAudioStatus('Track finished.');
        });

        loadSelectedTrack(false);
    }

});
