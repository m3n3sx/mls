import { defineConfig } from 'vite';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const isAnalyze = mode === 'analyze';
  
  return {
    // Build configuration
    build: {
      // Output directory for production builds
      outDir: 'dist',
      
      // Generate manifest.json for WordPress asset enqueuing
      manifest: true,
      
      // Source maps for debugging
      sourcemap: isDev ? 'inline' : true,
      
      // Rollup options for bundling
      rollupOptions: {
        input: {
          // Main entry point for modern admin
          'main-admin': resolve(__dirname, 'assets/js/modules/main-admin.js'),
        },
        output: {
          // Output format
          format: 'es',
          
          // Entry file naming pattern
          entryFileNames: isDev ? '[name].js' : '[name].[hash].js',
          
          // Chunk file naming pattern
          chunkFileNames: isDev ? 'chunks/[name].js' : 'chunks/[name].[hash].js',
          
          // Asset file naming pattern
          assetFileNames: isDev ? 'assets/[name].[ext]' : 'assets/[name].[hash].[ext]',
          
          // Manual chunks for code splitting (Task 18.1)
          // Requirements: 12.3, 12.5
          manualChunks(id) {
            // Vendor dependencies chunk (< 20KB target)
            if (id.includes('node_modules')) {
              // Split Zustand into separate vendor chunk
              if (id.includes('zustand')) {
                return 'vendor-zustand';
              }
              // Other vendor dependencies
              return 'vendor';
            }
            
            // Core modules chunk (< 30KB target)
            // State Manager, Event Bus, API Client
            if (id.includes('state-manager.js') || 
                id.includes('event-bus.js') || 
                id.includes('api-client.js')) {
              return 'core';
            }
            
            // Preview Engine chunk (< 40KB target)
            if (id.includes('preview-engine.js')) {
              return 'preview';
            }
            
            // Color System chunk (< 30KB target)
            if (id.includes('color-system.js')) {
              return 'color';
            }
            
            // Typography chunk (< 30KB target)
            if (id.includes('typography.js')) {
              return 'typography';
            }
            
            // Animations chunk (< 20KB target)
            if (id.includes('animations.js')) {
              return 'animations';
            }
            
            // Feature managers chunk (< 25KB target)
            if (id.includes('palette-manager.js') || 
                id.includes('template-manager.js')) {
              return 'managers';
            }
            
            // Utilities chunk (< 15KB target)
            if (id.includes('feature-flags.js') || 
                id.includes('event-adapter.js')) {
              return 'utils';
            }
          },
        },
      },
      
      // Minification settings (Task 18.3)
      // Requirement 12.5: Minimize bundle sizes to meet <100KB target
      minify: isDev ? false : 'terser',
      terserOptions: {
        compress: {
          drop_console: !isDev,
          drop_debugger: !isDev,
          // Additional compression options for smaller bundles
          passes: 2,
          pure_funcs: isDev ? [] : ['console.log', 'console.debug'],
          pure_getters: true,
          unsafe: false,
          unsafe_comps: false,
          unsafe_math: false,
          unsafe_proto: false,
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
        },
      },
      
      // Target modern browsers
      target: 'es2015',
      
      // Clear output directory before build
      emptyOutDir: true,
    },
    
    // Development server configuration
    server: {
      // Port for dev server
      port: 3000,
      
      // Enable HMR
      hmr: {
        protocol: 'ws',
        host: 'localhost',
      },
      
      // CORS for WordPress integration
      cors: true,
      
      // Watch options
      watch: {
        usePolling: false,
      },
    },
    
    // Resolve configuration
    resolve: {
      alias: {
        '@': resolve(__dirname, 'assets/js'),
        '@modules': resolve(__dirname, 'assets/js/modules'),
      },
    },
    
    // Define global constants
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: ['zustand'],
    },
    
    // Plugins (Task 18.3)
    plugins: [
      // Bundle analyzer plugin
      // Run with: npm run analyze
      isAnalyze && visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap', // 'sunburst', 'treemap', 'network'
      }),
    ].filter(Boolean),
    
    // Additional build optimizations (Task 18.3)
    // Requirement 12.5: Remove unused code with tree shaking
    esbuild: {
      // Drop console and debugger in production
      drop: isDev ? [] : ['console', 'debugger'],
      // Enable tree shaking
      treeShaking: true,
      // Minify identifiers
      minifyIdentifiers: !isDev,
      // Minify syntax
      minifySyntax: !isDev,
      // Minify whitespace
      minifyWhitespace: !isDev,
    },
  };
});
