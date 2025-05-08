// theme.d.ts
import { TypographyVariantsOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface TypographyVariants {
        text1: React.CSSProperties;
        text2: React.CSSProperties;
        text3: React.CSSProperties;
        text4: React.CSSProperties;
        text5: React.CSSProperties;
        text6: React.CSSProperties;
        text7: React.CSSProperties;
        text8: React.CSSProperties;
        text9: React.CSSProperties;
        text10: React.CSSProperties;
        text11: React.CSSProperties;
        text12: React.CSSProperties;
        text13: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        text1?: React.CSSProperties;
        text2?: React.CSSProperties;
        text3?: React.CSSProperties;
        text4?: React.CSSProperties;
        text5?: React.CSSProperties;
        text6?: React.CSSProperties;
        text7?: React.CSSProperties;
        text8?: React.CSSProperties;
        text9?: React.CSSProperties;
        text10?: React.CSSProperties;
        text11?: React.CSSProperties;
        text12?: React.CSSProperties;
        text13?: React.CSSProperties;

    }
}

// Update Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        text1: true;
        text2: true;
        text3: true;
        text4: true;
        text5: true;
        text6: true;
        text7: true;
        text8: true;
        text9: true;
        text10: true;
        text11: true;
        text12: true;
        text13: true;
    }
}
