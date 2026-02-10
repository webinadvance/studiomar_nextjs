<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Pdf.aspx.cs" Inherits="Pdf" %>

<%@ Import Namespace="System.Globalization" %>

<!DOCTYPE html>
<html lang="it">
<head>

    <title>K Y M E R A</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no,minimum-scale=1, maximum-scale=1, user-scalable=no" />
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="msapplication-starturl" content="/">
    <meta name="theme-color" content="#FF3D00">

    <link rel="icon" href="/Images/logoK_SQUARED.png">
    <link rel="apple-touch-icon" href="/Images/logoK_SQUARED. png">
    <link rel="shortcut icon" type="image/x-icon" href="/Images/logoK_SQUARED.ico" />
    <link rel="icon" type="image/x-icon" href="/Images/logoK_SQUARED.ico" />

    <meta name="msapplication-TileColor" content="#000000">
    <meta name="msapplication-TileImage" content="/Images/logoK_SQUARED.png">
    <meta name="theme-color" content="#000000">

    <link href="Styles/normalize.css" rel="stylesheet" />

    <link />

    <style type="text/css" media="screen,print">
        .pb_before {
            page-break-before: always !important;
        }

        .pb_after {
            page-break-after: always !important;
        }

        .pb_before_avoid {
            page-break-before: avoid !important;
        }

        .pb_after_avoid {
            page-break-after: avoid !important;
        }

        .pbi_avoid {
            page-break-inside: avoid !important;
        }
    </style>

</head>
<body style="color: #353940; padding: 0;">

    <div style="width: 25cm">

        <div class="pb_after"></div>

        <div style="font-size: 20px; margin-bottom: 6px;">Scadenze dal <span style="font-weight: bolder"><%=S_DATE_START %></span> al <span style="font-weight: bolder"><%=S_DATE_END %></span></div>

        <table style="width: 100%;">

            <%
                var index = 1;
                foreach (var scadenza in this.SCADENZE)
                {
            %>

            <tr>
                <td style="padding: 10px">
                    <span style="font-weight: normal; font-size: 16px; text-align: left"><%=index.ToString().PadLeft(3,'0') %></span>
                </td>
                <td style="padding: 10px">
                    <span style="font-weight: normal; padding: 0px; font-size: 16px;"><%=scadenza.NAME %></span>
                </td>
                <td style="padding: 10px">
                    <span style="font-weight: normal; padding: 0px; font-size: 14px;"><%=scadenza.RO_CLIENTI %></span>
                </td>
                <td style="padding: 10px">
                    <span style="font-weight: normal; padding: 0px; font-size: 14px;"><%=scadenza.RO_UTENTI %></span>
                </td>
                <td style="padding: 10px">
                    <span style="font-weight: bold; padding: 0px; font-size: 16px;"><%=scadenza.RO_SCADENZA_REALE.ToString("dd/MM/yyyy") %></span>
                </td>
            </tr>
            <%

                    index++;
                }
            %>
        </table>
    </div>
</body>
</html>
