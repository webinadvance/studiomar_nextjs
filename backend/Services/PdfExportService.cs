using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Backend.Services;

public class ScadenzaPdfItem
{
    public int Index { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Clienti { get; set; } = string.Empty;
    public string Utenti { get; set; } = string.Empty;
    public DateTime ScadenzaReale { get; set; }
}

public class PdfExportService
{
    public byte[] GenerateScadenzePdf(
        List<ScadenzaPdfItem> scadenze,
        string dateStart,
        string dateEnd)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        // Use fallback fonts for Docker environment
        QuestPDF.Settings.CheckIfAllTextGlyphsAreAvailable = false;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(1, Unit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(10).FontColor(Colors.Black).FontFamily("DejaVu Sans"));

                page.Header().Element(c => ComposeHeader(c, dateStart, dateEnd));
                page.Content().Element(c => ComposeContent(c, scadenze));
                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Pagina ");
                    x.CurrentPageNumber();
                    x.Span(" di ");
                    x.TotalPages();
                });
            });
        });

        return document.GeneratePdf();
    }

    private void ComposeHeader(IContainer container, string dateStart, string dateEnd)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().Text(text =>
                {
                    text.Span("Scadenze dal ").FontSize(16);
                    text.Span(dateStart).Bold().FontSize(16);
                    text.Span(" al ").FontSize(16);
                    text.Span(dateEnd).Bold().FontSize(16);
                });
            });
        });
    }

    private void ComposeContent(IContainer container, List<ScadenzaPdfItem> scadenze)
    {
        container.PaddingVertical(10).Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.ConstantColumn(40);   // Index
                columns.RelativeColumn(3);    // Name
                columns.RelativeColumn(2);    // Clienti
                columns.RelativeColumn(2);    // Utenti
                columns.ConstantColumn(80);   // Data
            });

            // Header
            table.Header(header =>
            {
                header.Cell().Element(CellStyle).Text("#").Bold();
                header.Cell().Element(CellStyle).Text("Descrizione").Bold();
                header.Cell().Element(CellStyle).Text("Clienti").Bold();
                header.Cell().Element(CellStyle).Text("Utenti").Bold();
                header.Cell().Element(CellStyle).Text("Scadenza").Bold();

                static IContainer CellStyle(IContainer container)
                {
                    return container
                        .Border(1)
                        .BorderColor(Colors.Grey.Lighten1)
                        .Background(Colors.Grey.Lighten3)
                        .Padding(5);
                }
            });

            // Data rows
            foreach (var item in scadenze)
            {
                table.Cell().Element(DataCellStyle).Text(item.Index.ToString("000"));
                table.Cell().Element(DataCellStyle).Text(item.Name);
                table.Cell().Element(DataCellStyle).Text(item.Clienti).FontSize(9);
                table.Cell().Element(DataCellStyle).Text(item.Utenti).FontSize(9);
                table.Cell().Element(DataCellStyle).Text(item.ScadenzaReale.ToString("dd/MM/yyyy")).Bold();
            }

            static IContainer DataCellStyle(IContainer container)
            {
                return container
                    .Border(1)
                    .BorderColor(Colors.Grey.Lighten2)
                    .Padding(5);
            }
        });
    }
}
