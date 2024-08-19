var convertedContent = '';

        function convertFile() {
            var fileInput = document.getElementById('fileInput');
            var file = fileInput.files[0];

            if (file) {
                showLoadingIndicator();
                convert(file);
            } else {
                alert('Por favor, selecione um arquivo.');
            }
        }

        function showLoadingIndicator() {
            document.getElementById('loadingIndicator').style.display = 'block';
        }

        function hideLoadingIndicator() {
            document.getElementById('loadingIndicator').style.display = 'none';
        }

        function showDocumentMessage() {
            document.getElementById('documentMessage').style.display = 'block';
        }

        function hideDocumentMessage() {
            document.getElementById('documentMessage').style.display = 'none';
        }

        function handleDragOver(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        }

        function handleFileDrop(event) {
            event.preventDefault();
            var file = event.dataTransfer.files[0];
            convert(file);
        }

        function handleFileSelection(event) {
            var file = event.target.files[0];
            convert(file);
        }

        function convert(file) {
            var reader = new FileReader();

            reader.onload = function(event) {
                var contents = event.target.result;
                var conversionFormat;
                var conversionCategory = document.getElementById('conversionCategory').value;
                if (conversionCategory === 'document') {
                    conversionFormat = document.getElementById('documentFormats').value;
                    showDocumentMessage();
                } else if (conversionCategory === 'image') {
                    conversionFormat = document.getElementById('imageFormats').value;
                    hideDocumentMessage();
                    showThumbnail(contents);
                } else if (conversionCategory === 'image3d') {
                    conversionFormat = document.getElementById('image3dFormats').value;
                    hideDocumentMessage();
                    showThumbnail(contents);
                }
                convertedContent = contents; // Não é necessário conversão para imagens
                displayResult();
                hideLoadingIndicator();
                document.getElementById('downloadButton').style.display = 'inline-block';
            };

            if (file.type.startsWith('image')) {
                reader.readAsArrayBuffer(file); // Usando readAsArrayBuffer para arquivos de imagem
            } else {
                reader.readAsText(file);
            }
        }

        function displayResult() {
            var resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            resultDiv.textContent = 'Convertido!';
            setTimeout(function() {
                resultDiv.style.display = 'none'; // Oculta o resultado após 3 segundos
            }, 3000);
        }

        function downloadConvertedFile() {
            var conversionFormat;
            var conversionCategory = document.getElementById('conversionCategory').value;
            if (conversionCategory === 'document') {
                conversionFormat = document.getElementById('documentFormats').value;
            } else if (conversionCategory === 'image') {
                conversionFormat = document.getElementById('imageFormats').value;
            } else if (conversionCategory === 'image3d') {
                conversionFormat = document.getElementById('image3dFormats').value;
            }
            var blob = new Blob([convertedContent], { type: 'application/octet-stream' }); // Alterado para application/octet-stream para imagens
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'arquivo_convertido.' + conversionFormat;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        }

        function toggleFormats() {
            var conversionCategory = document.getElementById('conversionCategory').value;
            var documentFormats = document.getElementById('documentFormats');
            var imageFormats = document.getElementById('imageFormats');
            var image3dFormats = document.getElementById('image3dFormats');

            if (conversionCategory === 'document') {
                documentFormats.classList.remove('hidden');
                imageFormats.classList.add('hidden');
                image3dFormats.classList.add('hidden');
            } else if (conversionCategory === 'image') {
                documentFormats.classList.add('hidden');
                imageFormats.classList.remove('hidden');
                image3dFormats.classList.add('hidden');
            } else if (conversionCategory === 'image3d') {
                documentFormats.classList.add('hidden');
                imageFormats.classList.add('hidden');
                image3dFormats.classList.remove('hidden');
            }
            displayResult(); // Mostra "Convertido!" sempre que um novo formato for escolhido
        }

        function showThumbnail(contents) {
            var thumbnailContainer = document.getElementById('thumbnailContainer');
            var thumbnail = document.getElementById('thumbnail');
            thumbnail.src = "data:image/jpeg;base64," + btoa(contents); // Convertendo conteúdo em base64 para exibição
            thumbnailContainer.style.display = 'block';
        }