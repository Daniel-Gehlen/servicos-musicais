export class FormManager {
  constructor() {
    this.currentStep = 1;
    this.formData = {};
    this.serviceFields = {
      transcription: ['songTitle', 'artistName', 'originalKey', 'difficultyLevel'],
      lessons: ['lessonInstrument', 'skillLevel', 'lessonFrequency', 'lessonGoals'],
      events: ['eventType', 'eventDate', 'eventDuration', 'guestCount'],
      composition: ['compositionType', 'musicStyle', 'tempo', 'suggestedKey']
    };
  }

  init() {
    this.setupStepper();
    this.setupServiceSelection();
    this.setupNavigation();
    this.setupFileUpload();
    this.setupFormSubmission();
    this.loadSavedData();
  }

  setupStepper() {
    this.updateStepUI();
  }

  updateStepUI() {
    // Atualizar steps visuais
    document.querySelectorAll('.step').forEach((step, index) => {
      step.classList.remove('active', 'completed');
      if (index + 1 < this.currentStep) {
        step.classList.add('completed');
      } else if (index + 1 === this.currentStep) {
        step.classList.add('active');
      }
    });

    // Mostrar/ocultar steps do formulário
    document.querySelectorAll('.form-step').forEach(step => {
      step.classList.remove('active');
      if (step.id === `formStep${this.currentStep}`) {
        step.classList.add('active');
      }
    });

    // Carregar campos dinâmicos para step 3
    if (this.currentStep === 3) {
      this.loadDynamicFields();
    }

    // Carregar resumo para step 4
    if (this.currentStep === 4) {
      this.loadSummary();
    }
  }

  setupServiceSelection() {
    document.querySelectorAll('input[name="serviceType"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.formData.serviceType = e.target.value;
        this.showServiceFields(e.target.value);
        this.saveFormData();
      });
    });
  }

  showServiceFields(serviceType) {
    // Ocultar todos os campos específicos
    document.querySelectorAll('.service-fields').forEach(field => {
      field.style.display = 'none';
    });

    // Mostrar campos do serviço selecionado
    const targetField = document.getElementById(`${serviceType}Fields`);
    if (targetField) {
      targetField.style.display = 'block';
      const serviceSpecific = document.getElementById('serviceSpecific');
      if (serviceSpecific) {
        serviceSpecific.style.display = 'block';
      }
    }
  }

  setupNavigation() {
    // Botões "Próximo"
    document.querySelectorAll('.btn-next').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const step = parseInt(e.target.closest('.form-step').id.replace('formStep', ''));
        if (this.validateStep(step)) {
          this.currentStep++;
          this.updateStepUI();
          this.saveFormData();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    // Botões "Anterior"
    document.querySelectorAll('.btn-prev').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const step = parseInt(e.target.closest('.form-step').id.replace('formStep', ''));
        this.currentStep = Math.max(1, step - 1);
        this.updateStepUI();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  validateStep(step) {
    const requiredFields = document.querySelectorAll(
      `#formStep${step} [required], #formStep${step} .required input, #formStep${step} .required select, #formStep${step} .required textarea`
    );

    let isValid = true;
    const firstInvalidField = [];

    requiredFields.forEach(field => {
      const value = field.type === 'checkbox' ? field.checked : field.value.trim();
      if (!value) {
        isValid = false;
        field.style.borderColor = '#e74c3c';
        if (firstInvalidField.length === 0) {
          firstInvalidField.push(field);
        }

        // Remover estilo quando o usuário começar a digitar
        field.addEventListener('input', () => {
          field.style.borderColor = '';
        }, { once: true });
      }
    });

    if (!isValid) {
      alert('Por favor, preencha todos os campos obrigatórios marcados com *.');
      if (firstInvalidField[0]) {
        firstInvalidField[0].focus();
      }
    }

    return isValid;
  }

  loadDynamicFields() {
    const dynamicFields = document.getElementById('dynamicFields');
    if (!dynamicFields || !this.formData.serviceType) return;

    const serviceType = this.formData.serviceType;
    let html = '';

    switch (serviceType) {
      case 'transcription':
        html = this.getTranscriptionFields();
        break;
      case 'lessons':
        html = this.getLessonsFields();
        break;
      case 'events':
        html = this.getEventsFields();
        break;
      case 'composition':
        html = this.getCompositionFields();
        break;
    }

    dynamicFields.innerHTML = html;
    this.loadFieldData(serviceType);
  }

  getTranscriptionFields() {
    return `
      <div class="service-specific">
        <h3><i class="fas fa-music"></i> Detalhes da Transcrição</h3>

        <div class="form-group">
          <label class="required">Título da música (se conhecido):</label>
          <input type="text" class="form-input" name="songTitle" placeholder="Ex: 'Garota de Ipanema'">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Artista/Banda:</label>
            <input type="text" class="form-input" name="artistName" placeholder="Ex: Tom Jobim">
          </div>

          <div class="form-group">
            <label>Tom original (se souber):</label>
            <input type="text" class="form-input" name="originalKey" placeholder="Ex: Ré Maior (D)">
          </div>
        </div>

        <div class="form-group">
          <label>Partes específicas que precisa (se aplicável):</label>
          <textarea class="form-textarea" name="specificParts" placeholder="Ex: 'Só preciso do solo de guitarra entre 1:20 e 2:15', 'Apenas a linha de baixo', etc." rows="3"></textarea>
        </div>

        <div class="form-group">
          <label>Nível de dificuldade desejado:</label>
          <div class="radio-group">
            <div class="radio-item">
              <input type="radio" id="diffEasy" name="difficultyLevel" value="easy">
              <label for="diffEasy">Simplificado (para iniciantes)</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="diffMedium" name="difficultyLevel" value="medium">
              <label for="diffMedium">Original (como no áudio)</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="diffHard" name="difficultyLevel" value="hard">
              <label for="diffHard">Avançado (com todas as nuances)</label>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getLessonsFields() {
    return `
      <div class="service-specific">
        <h3><i class="fas fa-graduation-cap"></i> Objetivos das Aulas</h3>

        <div class="form-group">
          <label class="required">Seus principais objetivos:</label>
          <div class="checkbox-group">
            <div class="checkbox-item">
              <input type="checkbox" id="goalBasics" name="lessonGoals[]" value="basics">
              <label for="goalBasics">Aprender o básico (primeiros acordes, batidas)</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="goalSongs" name="lessonGoals[]" value="songs">
              <label for="goalSongs">Tocar músicas específicas</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="goalTheory" name="lessonGoals[]" value="theory">
              <label for="goalTheory">Entender teoria musical</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="goalTechnique" name="lessonGoals[]" value="technique">
              <label for="goalTechnique">Melhorar técnica (dedilhado, palhetada)</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="goalImprov" name="lessonGoals[]" value="improv">
              <label for="goalImprov">Improvisação/solos</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="goalCompose" name="lessonGoals[]" value="compose">
              <label for="goalCompose">Compor minhas próprias músicas</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Estilos musicais de interesse:</label>
          <input type="text" class="form-input" name="musicInterests" placeholder="Ex: MPB, Rock, Sertanejo, Pop Internacional...">
          <div class="form-help">Isso me ajuda a preparar material relevante para você</div>
        </div>

        <div class="form-group">
          <label>Músicas específicas que gostaria de aprender:</label>
          <textarea class="form-textarea" name="desiredSongs" placeholder="Liste algumas músicas que você adoraria tocar (artista - música)" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label>Já teve aulas antes?</label>
          <div class="radio-group">
            <div class="radio-item">
              <input type="radio" id="experienceNone" name="previousExperience" value="none">
              <label for="experienceNone">Nunca</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="experienceSome" name="previousExperience" value="some">
              <label for="experienceSome">Algumas aulas/cursos online</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="experienceRegular" name="previousExperience" value="regular">
              <label for="experienceRegular">Já fiz aulas regulares antes</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Quanto tempo por semana pretende praticar?</label>
          <select class="form-select" name="practiceTime">
            <option value="">Selecione...</option>
            <option value="less1h">Menos de 1 hora</option>
            <option value="1-3h">1-3 horas</option>
            <option value="3-5h">3-5 horas</option>
            <option value="5+h">Mais de 5 horas</option>
          </select>
        </div>
      </div>
    `;
  }

  getEventsFields() {
    return `
      <div class="service-specific">
        <h3><i class="fas fa-glass-cheers"></i> Detalhes do Evento</h3>

        <div class="form-group">
          <label>Local do evento (endereço ou cidade):</label>
          <input type="text" class="form-input" name="eventLocation" placeholder="Ex: Porto Alegre/RS ou endereço completo">
        </div>

        <div class="form-group">
          <label>Ambiente do evento:</label>
          <div class="radio-group">
            <div class="radio-item">
              <input type="radio" id="venueIndoor" name="eventVenue" value="indoor">
              <label for="venueIndoor">Interno (salão, restaurante, casa)</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="venueOutdoor" name="eventVenue" value="outdoor">
              <label for="venueOutdoor">Externo (jardim, varanda, pátio)</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="venueMixed" name="eventVenue" value="mixed">
              <label for="venueMixed">Misto (área coberta e descoberta)</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Há equipamento de som disponível no local?</label>
          <div class="radio-group">
            <div class="radio-item">
              <input type="radio" id="soundYes" name="soundEquipment" value="yes">
              <label for="soundYes">Sim, completo</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="soundPartial" name="soundEquipment" value="partial">
              <label for="soundPartial">Parcial (precisarei trazer alguns itens)</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="soundNo" name="soundEquipment" value="no">
              <label for="soundNo">Não, preciso trazer tudo</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Repertório desejado:</label>
          <div class="form-row">
            <div class="form-group">
              <label>Estilo principal:</label>
              <select class="form-select" name="eventStyle">
                <option value="">Selecione...</option>
                <option value="classical">Clássico/Erudito</option>
                <option value="mpb">MPB/Bossa Nova</option>
                <option value="international">Internacional/Pop</option>
                <option value="mixed">Misto (vários estilos)</option>
                <option value="custom">Personalizado (especificar abaixo)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Intensidade musical:</label>
              <select class="form-select" name="musicIntensity">
                <option value="">Selecione...</option>
                <option value="background">Música de fundo (discreta)</option>
                <option value="interactive">Interativa (chama atenção)</option>
                <option value="featured">Destaque (momentos específicos)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Músicas específicas que gostaria no repertório:</label>
          <textarea class="form-textarea" name="eventPlaylist" placeholder="Liste músicas, artistas ou estilos que devem (ou não devem) ser incluídos" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label>Momento especial que requer música específica?</label>
          <textarea class="form-textarea" name="specialMoments" placeholder="Ex: 'Entrada da noiva com música X', 'Primeira dança com música Y', etc." rows="3"></textarea>
        </div>

        <div class="form-group">
          <label>Há algum código de vestimenta ou outra exigência?</label>
          <input type="text" class="form-input" name="dressCode" placeholder="Ex: 'Traje social preto', 'Esperamos que chegue 1h antes', etc.">
        </div>
      </div>
    `;
  }

  getCompositionFields() {
    return `
      <div class="service-specific">
        <h3><i class="fas fa-pen-nib"></i> Detalhes da Composição</h3>

        <div class="form-group">
          <label class="required">Título provisório (se já tiver):</label>
          <input type="text" class="form-input" name="compositionTitle" placeholder="Ex: 'Canção para Maria'">
        </div>

        <div class="form-group">
          <label>Inspirações ou referências:</label>
          <textarea class="form-textarea" name="compositionInspirations" placeholder="Descreva o clima, emoção, artistas ou músicas que servem de inspiração" rows="3"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Andamento (velocidade) desejado:</label>
            <select class="form-select" name="tempo">
              <option value="">Selecione...</option>
              <option value="slow">Lento (balada, emocional)</option>
              <option value="moderate">Moderado (média, confortável)</option>
              <option value="fast">Rápido (animado, energético)</option>
              <option value="varies">Variado (muda ao longo da música)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Tom sugerido (se tiver preferência):</label>
            <input type="text" class="form-input" name="suggestedKey" placeholder="Ex: Lá menor (Am), Sol maior (G)">
          </div>
        </div>

        <div class="form-group">
          <label>Estrutura desejada:</label>
          <div class="checkbox-group">
            <div class="checkbox-item">
              <input type="checkbox" id="structureIntro" name="compositionStructure[]" value="intro">
              <label for="structureIntro">Introdução</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="structureVerse" name="compositionStructure[]" value="verse">
              <label for="structureVerse">Versos</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="structureChorus" name="compositionStructure[]" value="chorus">
              <label for="structureChorus">Refrão</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="structureBridge" name="compositionStructure[]" value="bridge">
              <label for="structureBridge">Ponte</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="structureSolo" name="compositionStructure[]" value="solo">
              <label for="structureSolo">Solo instrumental</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="structureOutro" name="compositionStructure[]" value="outro">
              <label for="structureOutro">Final/Outro</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Instrumentação desejada:</label>
          <div class="checkbox-group">
            <div class="checkbox-item">
              <input type="checkbox" id="instGuitarComp" name="compositionInstruments[]" value="guitar">
              <label for="instGuitarComp">Violão/Guitarra (principal)</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="instVoice" name="compositionInstruments[]" value="voice">
              <label for="instVoice">Voz (para letra)</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="instBass" name="compositionInstruments[]" value="bass">
              <label for="instBass">Baixo</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="instDrums" name="compositionInstruments[]" value="drums">
              <label for="instDrums">Bateria/Percussão</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="instKeys" name="compositionInstruments[]" value="keys">
              <label for="instKeys">Teclado/Piano</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="instStrings" name="compositionInstruments[]" value="strings">
              <label for="instStrings">Cordas (violino, cello)</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Você já tem alguma parte pronta?</label>
          <div class="radio-group">
            <div class="radio-item">
              <input type="radio" id="materialNone" name="existingMaterial" value="none">
              <label for="materialNone">Nada, quero começar do zero</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="materialMelody" name="existingMaterial" value="melody">
              <label for="materialMelody">Tenho uma melodia/ideia básica</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="materialChords" name="existingMaterial" value="chords">
              <label for="materialChords">Tenho acordes/progressão</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="materialLyrics" name="existingMaterial" value="lyrics">
              <label for="materialLyrics">Tenho a letra/poema</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="materialDemo" name="existingMaterial" value="demo">
              <label for="materialDemo">Tenho uma demo/gravação simples</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Se já tem material, descreva-o:</label>
          <textarea class="form-textarea" name="existingMaterialDesc" placeholder="Descreva o que você já criou ou tem em mente" rows="3"></textarea>
        </div>
      </div>
    `;
  }

  loadFieldData(serviceType) {
    // Carregar dados salvos para campos específicos do serviço
    const savedData = this.getSavedFormData();
    if (!savedData) return;

    const fields = this.serviceFields[serviceType] || [];
    fields.forEach(fieldName => {
      const field = document.querySelector(`[name="${fieldName}"]`);
      if (field && savedData[fieldName]) {
        if (field.type === 'checkbox' || field.type === 'radio') {
          if (Array.isArray(savedData[fieldName])) {
            savedData[fieldName].forEach(value => {
              const input = document.querySelector(`[name="${fieldName}"][value="${value}"]`);
              if (input) input.checked = true;
            });
          } else {
            const input = document.querySelector(`[name="${fieldName}"][value="${savedData[fieldName]}"]`);
            if (input) input.checked = true;
          }
        } else {
          field.value = savedData[fieldName];
        }
      }
    });
  }

  setupFileUpload() {
    const fileInput = document.querySelector('input[name="projectFiles[]"]');
    const filePreview = document.getElementById('filePreview');

    if (fileInput && filePreview) {
      fileInput.addEventListener('change', (e) => {
        filePreview.innerHTML = '';

        if (e.target.files.length === 0) {
          filePreview.innerHTML = '<p style="color: #aaa; text-align: center;">Nenhum arquivo selecionado</p>';
          return;
        }

        Array.from(e.target.files).forEach((file, index) => {
          const fileItem = document.createElement('div');
          fileItem.className = 'file-preview-item';
          fileItem.innerHTML = `
            <i class="fas fa-file-audio" style="color: var(--accent);"></i>
            <span>${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            <button class="remove-file" data-index="${index}" style="margin-left: auto; background: none; border: none; color: #e74c3c; cursor: pointer;">
              <i class="fas fa-times"></i>
            </button>
          `;
          filePreview.appendChild(fileItem);
        });

        // Adicionar eventos para remover arquivos
        filePreview.querySelectorAll('.remove-file').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('button').dataset.index);
            this.removeFile(index, fileInput);
          });
        });
      });
    }
  }

  removeFile(index, fileInput) {
    const dt = new DataTransfer();
    const files = Array.from(fileInput.files);

    files.forEach((file, i) => {
      if (i !== index) {
        dt.items.add(file);
      }
    });

    fileInput.files = dt.files;
    fileInput.dispatchEvent(new Event('change'));
  }

  loadSummary() {
    const summary = document.getElementById('formSummary');
    if (!summary) return;

    // Coletar todos os dados do formulário
    const formData = this.collectFormData();
    summary.innerHTML = this.createSummaryHTML(formData);
  }

  collectFormData() {
    const data = {};
    const formElements = document.querySelectorAll('input, select, textarea');

    formElements.forEach(element => {
      if (element.name && !element.disabled) {
        if (element.type === 'checkbox') {
          if (!data[element.name]) {
            data[element.name] = [];
          }
          if (element.checked) {
            data[element.name].push(element.value);
          }
        } else if (element.type === 'radio') {
          if (element.checked) {
            data[element.name] = element.value;
          }
        } else {
          data[element.name] = element.value;
        }
      }
    });

    // Adicionar arquivos
    const fileInput = document.querySelector('input[name="projectFiles[]"]');
    if (fileInput && fileInput.files.length > 0) {
      data.files = Array.from(fileInput.files).map(f => ({
        name: f.name,
        size: f.size,
        type: f.type
      }));
    }

    return data;
  }

  createSummaryHTML(data) {
    const serviceNames = {
      transcription: 'Transcrição de Áudio para Partitura',
      lessons: 'Aulas Online',
      events: 'Música para Eventos',
      composition: 'Criação/Composição'
    };

    let html = '<h3 style="color: var(--accent); margin-bottom: 1.5rem;">Resumo do seu projeto</h3>';
    html += '<div class="summary-grid" style="display: grid; gap: 1rem;">';

    // Informações básicas
    if (data.serviceType) {
      html += `
        <div class="summary-item" style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px;">
          <div class="summary-label" style="font-weight: 600; color: var(--accent);">Tipo de serviço</div>
          <div class="summary-value" style="color: #ccc;">${serviceNames[data.serviceType] || data.serviceType}</div>
        </div>
      `;
    }

    if (data.fullName) {
      html += `
        <div class="summary-item" style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px;">
          <div class="summary-label" style="font-weight: 600; color: var(--accent);">Nome</div>
          <div class="summary-value" style="color: #ccc;">${data.fullName}</div>
        </div>
      `;
    }

    if (data.email) {
      html += `
        <div class="summary-item" style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px;">
          <div class="summary-label" style="font-weight: 600; color: var(--accent);">E-mail</div>
          <div class="summary-value" style="color: #ccc;">${data.email}</div>
        </div>
      `;
    }

    if (data.projectDescription) {
      html += `
        <div class="summary-item" style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px;">
          <div class="summary-label" style="font-weight: 600; color: var(--accent);">Descrição do projeto</div>
          <div class="summary-value" style="color: #ccc;">${data.projectDescription.substring(0, 200)}${data.projectDescription.length > 200 ? '...' : ''}</div>
        </div>
      `;
    }

    if (data.budgetRange && data.budgetRange !== '') {
      html += `
        <div class="summary-item" style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px;">
          <div class="summary-label" style="font-weight: 600; color: var(--accent);">Faixa de orçamento</div>
          <div class="summary-value" style="color: #ccc;">${data.budgetRange}</div>
        </div>
      `;
    }

    if (data.files && data.files.length > 0) {
      html += `
        <div class="summary-item" style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px;">
          <div class="summary-label" style="font-weight: 600; color: var(--accent);">Arquivos anexados</div>
          <div class="summary-value" style="color: #ccc;">${data.files.length} arquivo(s)</div>
        </div>
      `;
    }

    html += '</div>';
    return html;
  }

  setupFormSubmission() {
    const submitBtn = document.getElementById('submitForm');
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Validar aceitação dos termos
        const acceptTerms = document.getElementById('acceptTerms');
        if (!acceptTerms || !acceptTerms.checked) {
          alert('Você precisa aceitar os Termos de Serviço e Política de Privacidade para enviar o projeto.');
          acceptTerms?.scrollIntoView({ behavior: 'smooth' });
          acceptTerms?.focus();
          return;
        }

        if (this.validateStep(4)) {
          this.submitForm();
        }
      });
    }
  }

  async submitForm() {
    const submitData = this.collectFormData();
    const progressSummary = document.getElementById('progressSummary');

    try {
      // Mostrar indicador de carregamento
      if (progressSummary) {
        progressSummary.style.display = 'block';
        submitBtn.disabled = true;
      }

      // Simular envio (em produção, enviaria para um servidor)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Salvar projeto
      this.saveProject(submitData);

      // Limpar dados salvos
      localStorage.removeItem('formDraft');

      // Mostrar sucesso
      this.showSuccessMessage();

      // Redirecionar
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 3000);

    } catch (error) {
      this.showErrorMessage(error);
    } finally {
      if (progressSummary) {
        progressSummary.style.display = 'none';
      }
      const submitBtn = document.getElementById('submitForm');
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  }

  saveProject(data) {
    const projects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    const project = {
      ...data,
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
      projectId: 'PROJ-' + Date.now().toString().slice(-6)
    };

    projects.push(project);
    localStorage.setItem('userProjects', JSON.stringify(projects));

    // Salvar também como último projeto enviado
    localStorage.setItem('lastProject', JSON.stringify(project));

    return project;
  }

  showSuccessMessage() {
    alert(`✅ Projeto enviado com sucesso!\n\nObrigado por enviar seu projeto musical! Em breve entrarei em contato pelo e-mail fornecido para discutirmos os próximos passos.\n\nNúmero do projeto: PROJ-${Date.now().toString().slice(-6)}\n\nVocê será redirecionado para a página inicial em alguns segundos.`);
  }

  showErrorMessage(error) {
    alert(`❌ Ocorreu um erro ao enviar seu projeto:\n\n${error.message || 'Erro desconhecido'}\n\nPor favor, tente novamente ou entre em contato diretamente pelo WhatsApp.`);
  }

  // Persistência de dados entre steps
  saveFormData() {
    const data = this.collectFormData();
    data.currentStep = this.currentStep;
    localStorage.setItem('formDraft', JSON.stringify(data));
  }

  loadSavedData() {
    try {
      const savedData = JSON.parse(localStorage.getItem('formDraft'));
      if (!savedData) return;

      // Restaurar step
      this.currentStep = savedData.currentStep || 1;

      // Restaurar dados nos campos
      Object.keys(savedData).forEach(key => {
        if (key === 'currentStep' || key === 'files') return;

        const value = savedData[key];
        const field = document.querySelector(`[name="${key}"]`);

        if (!field) return;

        if (field.type === 'checkbox' && Array.isArray(value)) {
          value.forEach(val => {
            const checkbox = document.querySelector(`[name="${key}"][value="${val}"]`);
            if (checkbox) checkbox.checked = true;
          });
        } else if (field.type === 'radio') {
          const radio = document.querySelector(`[name="${key}"][value="${value}"]`);
          if (radio) radio.checked = true;

          // Se for serviceType, mostrar campos específicos
          if (key === 'serviceType') {
            this.formData.serviceType = value;
            setTimeout(() => this.showServiceFields(value), 100);
          }
        } else {
          field.value = value;
        }
      });

      // Atualizar UI
      this.updateStepUI();

    } catch (error) {
      console.warn('Não foi possível carregar dados salvos:', error);
    }
  }

  getSavedFormData() {
    try {
      return JSON.parse(localStorage.getItem('formDraft'));
    } catch (error) {
      return null;
    }
  }
}
