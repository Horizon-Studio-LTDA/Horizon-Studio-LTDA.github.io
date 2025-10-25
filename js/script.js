// pre load client data
document.addEventListener("DOMContentLoaded", function () {

    const dataLogos = {
        1: "/assets/images/guide_me-logo.svg",
        2: "/assets/images/preceasy-logo.svg",
        3: "/assets/images/voteapp-logo.svg"
    }

    // Apenas substitui o texto pelas imagens
    const feedbackOptions = document.querySelectorAll('.feedback-options .option');

    feedbackOptions.forEach(option => {
        const feedbackId = option.getAttribute('data-feedback');
        const logoPath = dataLogos[feedbackId];

        // Limpa o conteúdo atual (remove o span com texto)
        option.innerHTML = '';

        // Cria e adiciona a imagem
        const img = document.createElement('img');
        img.src = logoPath;
        img.alt = `Logo ${feedbackId}`;
        img.className = 'feedback-logo';

        option.appendChild(img);
    });

    const data = {
        logo: "/assets/images/guide_me-logo.svg",
        text: "Trabalhar com a Horizon Studio foi uma experiência excelente do início ao fim. O time conseguiu traduzir perfeitamente a essência do nosso negócio e transformar nossa ideia em um negócio moderno e consolidado. O cuidado em cada etapa, desde o branding até o design do nosso sistema, foi notável. O resultado final superou nossas expectativas, a empresa ganhou uma Marca sólida e uma presença digital forte, assim como uma interface funcional, intuitiva e visualmente impecável. Com certeza, recomendamos a Horizon Studio para qualquer empresa que queira elevar o nível do seu projeto.",
        name: "Heverton Bezerra",
        position: "Sócio-Fundador"
    }

    const feedbackContent = document.querySelector('.feedback-content');

    if (data && feedbackContent) {
        const clientLogoElement = feedbackContent.querySelector('.client-logo');
            clientLogoElement.innerHTML = '';
            const logoImg = document.createElement('img');
            logoImg.src = data.logo;
            logoImg.alt = "Logo da empresa";
            logoImg.className = 'client-logo-img';

            clientLogoElement.appendChild(logoImg);
        feedbackContent.querySelector('.feedback-text p').textContent = data.text;
        feedbackContent.querySelector('.client-details h4').textContent = data.name;
        feedbackContent.querySelector('.client-details p').textContent = data.position;
    }


});


document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // FAQ toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Feedback options functionality
    const feedbackOptions = document.querySelectorAll('.feedback-options .option');

    // Mock data for different feedbacks
    const feedbackData = {
        1: {
            logo: "/assets/images/guide_me-logo.svg",
            text: "Trabalhar com a Horizon Studio foi uma experiência excelente do início ao fim. O time conseguiu traduzir perfeitamente a essência do nosso negócio e transformar nossa ideia em um negócio moderno e consolidado. O cuidado em cada etapa, desde o branding até o design do nosso sistema, foi notável. O resultado final superou nossas expectativas, a empresa ganhou uma Marca sólida e uma presença digital forte, assim como uma interface funcional, intuitiva e visualmente impecável. Com certeza, recomendamos a Horizon Studio para qualquer empresa que queira elevar o nível do seu projeto.",
            name: "Heverton Bezerra",
            position: "Sócio-Fundador"
        },
        3: {
            logo: "/assets/images/preceasy-logo.svg",
            text: "Desde o primeiro momento, percebi que Horizon seria a parceira ideal para o projeto, a equipe conseguiu captar de maneira integral todos os pontos para o desenvolvimento dessa solução, demonstrando uma disponibilidade e dedicação com entregas das demandas, buscaram entender de fato sobre nossos clientes, trazendo aplicações humanizadas, respeitando nossas diretrizes e consequentemente resultados financeiros e de escala são destacados. Se tornado assim um elo fundamental na execução e no sucesso de nosso trabalho.",
            name: "Marcos André",
            position: "CEO"
        },
        2: {
            logo: "/assets/images/voteapp-logo.svg",
            text: "A Horizon Studio foi essencial para transformar o VoteApp em uma plataforma moderna, segura e de fácil utilização. Desde o branding até o desenvolvimento do sistema de votação, o time demonstrou total comprometimento e excelência técnica. O sistema ficou incrível, intuitivo, elegante e totalmente alinhado com a proposta do projeto. A equipe da Horizon entendeu exatamente o que queríamos e entregou muito mais do que esperávamos. Hoje o VoteApp transmite credibilidade e inovação, graças a um trabalho impecável do início ao fim.",
            name: "Gerianderson Oliveira",
            position: "Fundador"
        },
    };

    feedbackOptions.forEach(option => {
        option.addEventListener('click', function () {
            // Remove active class from all options
            feedbackOptions.forEach(opt => opt.classList.remove('active'));

            // Add active class to clicked option
            this.classList.add('active');

            // Get feedback ID
            const feedbackId = this.getAttribute('data-feedback');

            // Update feedback content
            updateFeedbackContent(feedbackId);
        });
    });

    function updateFeedbackContent(feedbackId) {
        const data = feedbackData[feedbackId];
        const feedbackContent = document.querySelector('.feedback-content');

        if (data && feedbackContent) {

            const clientLogoElement = feedbackContent.querySelector('.client-logo');
            clientLogoElement.innerHTML = '';

            const logoImg = document.createElement('img');
            logoImg.src = data.logo;
            logoImg.alt = "Logo da empresa";
            logoImg.className = 'client-logo-img';

            clientLogoElement.appendChild(logoImg);

            feedbackContent.querySelector('.feedback-text p').textContent = data.text;
            feedbackContent.querySelector('.client-details h4').textContent = data.name;
            feedbackContent.querySelector('.client-details p').textContent = data.position;
        }
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to navbar
    window.addEventListener('scroll', function () {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
});