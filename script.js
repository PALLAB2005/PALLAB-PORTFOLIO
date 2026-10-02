(() => {
    const html = document.documentElement;
    const toastContainer = document.getElementById('toast-container');

    function setStorage(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.warn('Storage unavailable:', error);
        }
    }

    function getStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn('Storage unavailable:', error);
            return null;
        }
    }

    function updateTime() {
        const timeDisplay = document.getElementById('local-time');
        if (!timeDisplay) return;

        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    }

    function applyTheme(theme) {
        html.classList.toggle('dark', theme === 'dark');
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        themeToggle.innerHTML = theme === 'dark'
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    }

    function showToast(message, type = 'success') {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        const icon = type === 'success'
            ? '<i class="fas fa-check-circle"></i>'
            : '<i class="fas fa-exclamation-circle"></i>';
        const colorClass = type === 'success'
            ? 'bg-slate-900 text-white dark:bg-white dark:text-black'
            : 'bg-red-500 text-white';

        toast.className = `flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl font-medium text-sm toast-enter toast-enter-active ${colorClass}`;
        toast.innerHTML = `${icon} <span>${message}</span>`;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('toast-enter-active');
            toast.classList.add('toast-exit-active');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hide');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600);
            }, 1000);
        }, { once: true });
    }

    const year = document.getElementById('year');
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    const themeToggle = document.getElementById('theme-toggle');
    const preferredTheme = getStorage('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (preferredTheme === 'dark' || (!preferredTheme && systemPrefersDark)) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const nextTheme = html.classList.contains('dark') ? 'light' : 'dark';
            applyTheme(nextTheme);
            setStorage('theme', nextTheme);
        });
    }

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMenu = () => {
        if (!mobileMenu) return;

        const isOpen = mobileMenu.style.opacity === '1';
        mobileMenu.style.opacity = isOpen ? '0' : '1';
        mobileMenu.style.pointerEvents = isOpen ? 'none' : 'auto';
    };

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', toggleMenu);
    }

    mobileLinks.forEach((link) => link.addEventListener('click', toggleMenu));

    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const sections = document.querySelectorAll('.section-spy');
    const navLinks = document.querySelectorAll('.nav-link');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            const isVisible = window.scrollY > 300;
            scrollToTopBtn.classList.toggle('translate-y-20', !isVisible);
            scrollToTopBtn.classList.toggle('opacity-0', !isVisible);
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id') || '';
                }
            });

            navLinks.forEach((link) => {
                const href = link.getAttribute('href') || '';
                link.classList.remove('text-primary', 'dark:text-white', 'font-bold');
                link.classList.add('text-slate-600', 'dark:text-slate-400');

                if (href.includes(current)) {
                    link.classList.add('text-primary', 'dark:text-white', 'font-bold');
                    link.classList.remove('text-slate-600', 'dark:text-slate-400');
                }
            });
        });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-item');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((filterBtn) => filterBtn.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projects.forEach((project) => {
                const categories = (project.getAttribute('data-filter-category') || '').split(' ');
                const shouldShow = filterValue === 'all' || categories.includes(filterValue);

                project.style.display = shouldShow ? 'block' : 'none';
                project.classList.toggle('reveal-on-scroll', shouldShow);
                project.classList.toggle('is-visible', shouldShow);
            });
        });
    });

    if (window.matchMedia('(min-width: 768px)').matches) {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    const parallaxImages = document.querySelectorAll('.parallax-img');
    window.addEventListener('scroll', () => {
        parallaxImages.forEach((img) => {
            const parent = img.parentElement;
            if (!parent) return;

            const rect = parent.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (isVisible) {
                const speed = 0.08;
                const yPos = (window.innerHeight - rect.top) * speed;
                img.style.transform = `translateY(${yPos - 20}px) scale(1.1)`;
            }
        });
    });

    const modal = document.getElementById('project-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtn = document.getElementById('close-modal');
    const triggers = document.querySelectorAll('.project-trigger');

    const mTitle = document.getElementById('modal-title');
    const mCategory = document.getElementById('modal-category');
    const mImage = document.getElementById('modal-image');
    const mDesc = document.getElementById('modal-desc');

    function openModal(data) {
        if (!modal || !mTitle || !mCategory || !mImage || !mDesc) return;

        mTitle.textContent = data.title;
        mCategory.textContent = data.category;
        mImage.src = data.image;
        mDesc.textContent = data.desc;

        modal.classList.remove('hidden');

        setTimeout(() => {
            if (modalBackdrop) modalBackdrop.classList.remove('opacity-0');
            if (modalContent) {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }
        }, 10);

        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        if (!modal || !modalBackdrop || !modalContent) return;

        modalBackdrop.classList.add('opacity-0');
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    triggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const data = {
                title: trigger.dataset.title || 'Project',
                category: trigger.dataset.category || 'Project',
                image: trigger.dataset.image || '',
                desc: trigger.dataset.desc || '',
            };
            openModal(data);
        });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', hideModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            hideModal();
        }
    });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            if (!btn) return;

            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-circle-notch animate-spin"></i> Mengirim...';
            btn.disabled = true;

            setTimeout(() => {
                showToast('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.');
                e.target.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    const shareModal = document.getElementById('share-modal');
    const shareModalBackdrop = document.getElementById('share-modal-backdrop');
    const sharePanel = document.getElementById('share-panel');
    const shareTrigger = document.getElementById('share-trigger');
    const bottomShareToggle = document.getElementById('bottom-share-toggle');
    const bottomShareClose = document.getElementById('bottom-share-close');
    const shareUrlInput = document.getElementById('share-url');
    const copyLinkBtn = document.getElementById('copy-link');
    const qrImage = document.getElementById('share-qr');
    const downloadQrBtn = document.getElementById('download-qr');
    const shareUrl = 'https://pallab-portfolio-rosy.vercel.app/';

    if (shareUrlInput) {
        shareUrlInput.value = shareUrl;
    }

    function openShareModal() {
        if (!shareModal || !shareModalBackdrop || !sharePanel) return;

        shareModal.classList.remove('hidden');
        setTimeout(() => {
            shareModalBackdrop.classList.remove('opacity-0');
            sharePanel.classList.remove('scale-95', 'opacity-0');
            sharePanel.classList.add('scale-100', 'opacity-100');
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    function closeShareModal() {
        if (!shareModal || !shareModalBackdrop || !sharePanel) return;

        shareModalBackdrop.classList.add('opacity-0');
        sharePanel.classList.remove('scale-100', 'opacity-100');
        sharePanel.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            shareModal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    if (shareTrigger) shareTrigger.addEventListener('click', openShareModal);

    if (bottomShareToggle) {
        bottomShareToggle.addEventListener('click', () => {
            if (!shareModal) return;
            if (shareModal.classList.contains('hidden')) {
                openShareModal();
            } else {
                closeShareModal();
            }
        });
    }

    if (bottomShareClose) bottomShareClose.addEventListener('click', closeShareModal);
    if (shareModalBackdrop) shareModalBackdrop.addEventListener('click', closeShareModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && shareModal && !shareModal.classList.contains('hidden')) {
            closeShareModal();
        }
    });

    if (downloadQrBtn && qrImage) {
        downloadQrBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = qrImage.src;
            link.download = 'PALLAB_QR.svg';
            link.click();
        });
    }

    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', async () => {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(shareUrl);
                    showToast('Portfolio link copied!');
                    return;
                }

                if (shareUrlInput) {
                    shareUrlInput.select();
                    document.execCommand('copy');
                }
                showToast('Link copied to clipboard');
            } catch (error) {
                if (shareUrlInput) {
                    shareUrlInput.select();
                    document.execCommand('copy');
                }
                showToast('Link copied to clipboard');
            }
        });
    }

    const shareButtons = document.querySelectorAll('.share-option');
    shareButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const type = button.dataset.share;
            const url = encodeURIComponent(shareUrl);
            const text = encodeURIComponent('Check out my portfolio');

            if (type === 'whatsapp') {
                window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
            } else if (type === 'telegram') {
                window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
            } else if (type === 'facebook') {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
            } else if (type === 'x') {
                window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
            } else if (navigator.share) {
                navigator.share({ title: 'PALLAB Portfolio', text: 'Check out my portfolio', url: shareUrl });
            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(shareUrl).then(() => showToast('Portfolio link copied!'));
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => revealObserver.observe(el));

    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    if (window.matchMedia('(min-width: 768px)').matches) {
        magneticBtns.forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    const spotlightCards = document.querySelectorAll('.spotlight-card');
    spotlightCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    updateTime();
    setInterval(updateTime, 1000);
})();
