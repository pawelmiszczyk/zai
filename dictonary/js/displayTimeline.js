// Funkcja do pobierania danych z serwera za pomocą AJAX
function getEventsData(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../php/getEvents.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var eventsData = JSON.parse(xhr.responseText);
            callback(eventsData);
        }
    };
    xhr.send();
}

// Funkcja do pobierania kategorii za pomocą AJAX
function getCategories(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../php/getCategories.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var categoriesData = JSON.parse(xhr.responseText);
            callback(categoriesData);
        }
    };
    xhr.send();
}

// Funkcja do wyświetlania wydarzeń na osi czasu
function displayEventsOnTimeline(eventsData, selectedCategory) {
    // Usuń poprzednią oś czasu
    d3.select("svg").remove();

    // Ustawienia oś czasu
    var timelineWidth = 1200;
    var timelineHeight = 100;
    var lineHeight = 30; // Zwiększ grubość linii czasu
    var yPosition = 50; // Stała pozycja y dla linii czasu

    // Tworzenie skali czasu
    var parseTime = d3.timeParse("%Y-%m-%d");

    var minDate = d3.min(eventsData, function (d) { return parseTime(d.start_date); });
    var maxDate = d3.max(eventsData, function (d) { return parseTime(d.end_date); });
    minDate.setDate(minDate.getDate());
    maxDate.setDate(maxDate.getDate() + 1); 

    var xScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, timelineWidth]);

    // Tworzenie oś czasu
    var svg = d3.select("#timeline")
        .append("svg")
        .attr("width", timelineWidth)
        .attr("height", timelineHeight);

    var tooltip = d3.select(".event-tooltip");

    // Filtrowanie wydarzeń na podstawie wybranej kategorii
    var filteredEvents = eventsData;
    if (selectedCategory !== "all") {
        filteredEvents = eventsData.filter(function (event) {
            return event.category_id == selectedCategory;
        });
    }

    // Rysowanie linii łączących wydarzenia
    svg.selectAll(".event-line")
        .data(filteredEvents)
        .enter()
        .append("rect")
        .attr("class", "event-line")
        .attr("x", function (d) { return xScale(parseTime(d.start_date)); })
        .attr("y", yPosition - lineHeight / 2)
        .attr("width", function (d) {
            var startDate = parseTime(d.start_date);
            var endDate = parseTime(d.end_date);
            startDate.setDate(startDate.getDate());
            endDate.setDate(endDate.getDate() + 1); // Dodajemy jeden dzień
            return xScale(endDate) - xScale(startDate);
        })
        .attr("height", lineHeight)
        .style("stroke", function (d) {
            if (d.category_color !== undefined && d.category_color !== null) {
                return d.category_color.toString();
            } else {
                return "steelblue";
            }
        })
        .style("fill", function (d) {
            if (d.category_color !== undefined && d.category_color !== null) {
                return d.category_color.toString();
            } else {
                return "steelblue";
            }
        });

    // Dymki po najechaniu na linie czasu
    svg.selectAll(".event-line")
        .on("mouseover", function (d) {
            var tooltip = d3.select(".event-tooltip");

            // Wyświetlanie dymka po najechaniu kursorem na linię czasu
            tooltip.html("<strong>Nazwa:</strong> " + d.event_name + "<br><strong>Data rozpoczęcia:</strong> " + d.start_date + "<br><strong>Data zakończenia:</strong> " + d.end_date + "<br><strong>Opis:</strong> " + d.description);

            // Dodaj obrazek do dymka, jeśli jest dostępny
            if (d.image_url) {
                tooltip.append("img")
                    .attr("src", "data:image/jpeg;base64," + d.image_url)
                    .attr("width", 600)
                    .style("display", "block");
            }

            var tooltipWidth = tooltip.node().getBoundingClientRect().width;
            var tooltipHeight = tooltip.node().getBoundingClientRect().height;
            var pageX = d3.event.pageX;
            var pageY = d3.event.pageY;

            // Sprawdź, czy dymek wykracza poza prawy lub dolny kraniec ekranu
            if (pageX + tooltipWidth > window.innerWidth) {
                pageX = window.innerWidth - tooltipWidth;
            }

            if (pageY + tooltipHeight > window.innerHeight) {
                pageY = window.innerHeight - tooltipHeight;
            }

            tooltip.style("left", pageX + "px")
                .style("top", pageY + "px")
                .style("display", "block");
        })
        .on("mouseout", function (d) {
            // Ukrywanie dymka po zjechaniu kursorem z lini czasu
            tooltip.style("display", "none");
        });
}

// Pobierz kategorie i wydarzenia, a następnie wyświetl na osi czasu
getCategories(function (categoriesData) {
    // Wygeneruj opcje listy rozwijanej na podstawie kategorii
    var categorySelect = document.getElementById("categorySelect");

    categoriesData.forEach(function (category) {
        var option = document.createElement("option");
        option.value = category.category_id;
        option.text = category.category_name;
        categorySelect.appendChild(option);
    });

    // Obsługa zmiany wybranej kategorii
    categorySelect.addEventListener("change", function () {
        var selectedCategory = categorySelect.value;
        getEventsData(function (eventsData) {
            displayEventsOnTimeline(eventsData, selectedCategory);
        });
    });

    // Pobierz początkowe wydarzenia
    getEventsData(function (eventsData) {
        displayEventsOnTimeline(eventsData, "all"); // Domyślnie "Wszystkie" kategorie
    });
});
