/**
 * MASE Gradient Builder Module
 *
 * Provides visual gradient builder interface with:
 * - Gradient type selector (linear/radial)
 * - Visual angle dial for linear gradients
 * - Color stop management (add/remove/edit)
 * - Live gradient preview
 * - Integration with live preview system
 *
 * @package ModernAdminStyler
 * @since 1.3.0
 */

(function ($) {
  'use strict';

  // Ensure MASE namespace exists
  window.MASE = window.MASE || {};

  /**
   * Gradient Builder Module
   */
  MASE.gradientBuilder = {
    /**
     * Current area being edited
     */
    currentArea: null,

    /**
     * Cached DOM elements
     * Task 35: Minimize DOM queries using caching
     */
    domCache: {},

    /**
     * Debounced update function
     * Task 35: Debounce live preview updates (300ms)
     */
    debouncedUpdatePreview: null,

    /**
     * Initialize gradient builder
     */
    init: function () {
      // Initialize DOM cache
      this.initDOMCache();

      // Create debounced update function
      if (MASE.assetLoader && typeof MASE.assetLoader.debounce === 'function') {
        this.debouncedUpdatePreview = MASE.assetLoader.debounce(this.updatePreview.bind(this), 300);
      } else {
        // Fallback debounce implementation
        this.debouncedUpdatePreview = this.createFallbackDebounce(
          this.updatePreview.bind(this),
          300,
        );
      }

      this.initTypeSelector();
      this.initAngleControl();
      this.initColorStops();
      this.initColorPickers();
      this.initPresets();
      this.updateAllPreviews();
    },

    /**
     * Initialize DOM cache
     * Task 35: Minimize DOM queries using caching
     */
    initDOMCache: function () {
      this.domCache = {
        $gradientTypes: $('.mase-gradient-type'),
        $angleDials: $('.mase-gradient-angle-dial'),
        $angleInputs: $('.mase-gradient-angle-input'),
        $colorStopsContainers: $('.mase-gradient-color-stops'),
        $addColorStopButtons: $('.mase-add-color-stop'),
        $gradientPreviews: $('.mase-gradient-preview'),
        $presetGrids: $('.mase-gradient-preset-grid'),
        $categoryFilters: $('.mase-gradient-category-filter'),
      };
    },

    /**
     * Fallback debounce implementation
     * Used if assetLoader is not available
     */
    createFallbackDebounce: function (func, wait) {
      let timeout;
      return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
      };
    },

    /**
     * Initialize gradient type selector (linear/radial)
     */
    initTypeSelector: function () {
      const self = this;

      $('.mase-gradient-type').on('change', function () {
        const $select = $(this);
        const type = $select.val();
        const area = $select.data('area');

        // Show/hide angle control based on type
        const $angleRow = $select
          .closest('.mase-background-gradient-controls')
          .find('.mase-gradient-angle-row');

        if (type === 'linear') {
          $angleRow.show();
        } else {
          $angleRow.hide();
        }

        // Update preview
        self.updatePreview(area);
      });
    },

    /**
     * Initialize angle control with visual dial
     */
    initAngleControl: function () {
      const self = this;

      // Draggable dial
      $('.mase-gradient-angle-dial').on('mousedown', function (e) {
        e.preventDefault();

        const $dial = $(this);
        const area = $dial.data('area');
        const $input = $dial
          .closest('.mase-gradient-angle-control')
          .find('.mase-gradient-angle-input');
        const startAngle = parseInt($input.val()) || 0;
        const startY = e.pageY;

        // Add grabbing cursor
        $dial.css('cursor', 'grabbing');

        // Mouse move handler
        $(document).on('mousemove.gradient-dial', function (e) {
          const deltaY = startY - e.pageY;
          let newAngle = startAngle + deltaY;

          // Normalize angle to 0-360 range
          newAngle = ((newAngle % 360) + 360) % 360;

          // Update input and dial
          $input.val(Math.round(newAngle));
          $dial.css('transform', 'rotate(' + newAngle + 'deg)');

          // Update preview (debounced)
          self.updatePreviewDebounced(area);
        });

        // Mouse up handler
        $(document).on('mouseup.gradient-dial', function () {
          $(document).off('.gradient-dial');
          $dial.css('cursor', 'grab');

          // Final preview update
          self.updatePreview(area);
        });
      });

      // Input change handler
      $('.mase-gradient-angle-input').on('input change', function () {
        const $input = $(this);
        const area = $input.data('area');
        let angle = parseInt($input.val()) || 0;

        // Clamp angle to 0-360
        if (angle < 0) {
          angle = 0;
        }
        if (angle > 360) {
          angle = 360;
        }
        $input.val(angle);

        // Update dial rotation
        const $dial = $input
          .closest('.mase-gradient-angle-control')
          .find('.mase-gradient-angle-dial');
        $dial.css('transform', 'rotate(' + angle + 'deg)');

        // Update preview
        self.updatePreviewDebounced(area);
      });
    },

    /**
     * Initialize color stops management
     */
    initColorStops: function () {
      const self = this;

      // Add color stop button
      $(document).on('click', '.mase-add-color-stop', function (e) {
        e.preventDefault();
        const area = $(this).data('area');
        self.addColorStop(area);
      });

      // Remove color stop button
      $(document).on('click', '.mase-remove-color-stop', function (e) {
        e.preventDefault();

        if ($(this).is(':disabled')) {
          return;
        }

        const area = $(this).data('area');
        const $colorStop = $(this).closest('.mase-color-stop');
        const index = $colorStop.data('index');

        // Remove the color stop
        $colorStop.remove();

        // Reindex remaining stops
        self.reindexColorStops(area);

        // Update button states
        self.updateColorStopButtons(area);

        // Trigger accessibility event
        $(document).trigger('mase:colorStopRemoved', [{ area: area, index: index }]);

        // Update preview
        self.updatePreview(area);
      });

      // Color/position change handlers
      $(document).on('input change', '.mase-color-stop input', function () {
        const area = $(this).closest('.mase-gradient-color-stops').data('area');
        self.updatePreviewDebounced(area);
      });
    },

    /**
     * Initialize WordPress color pickers
     */
    initColorPickers: function () {
      const self = this;

      // Initialize existing color pickers
      $('.mase-color-picker').each(function () {
        const $input = $(this);

        // Skip if already initialized
        if ($input.hasClass('wp-color-picker')) {
          return;
        }

        $input.wpColorPicker({
          change: function (event, ui) {
            const area = $(event.target).closest('.mase-gradient-color-stops').data('area');
            self.updatePreviewDebounced(area);
          },
          clear: function (event) {
            const area = $(event.target).closest('.mase-gradient-color-stops').data('area');
            self.updatePreviewDebounced(area);
          },
        });
      });
    },

    /**
     * Add new color stop
     */
    addColorStop: function (area) {
      const $container = $('.mase-gradient-color-stops[data-area="' + area + '"]');
      const $stops = $container.find('.mase-color-stop');
      const stopCount = $stops.length;

      // Check maximum limit
      if (stopCount >= 10) {
        if (window.MASE && window.MASE.showNotice) {
          const message =
            window.maseAdmin &&
            window.maseAdmin.strings &&
            window.maseAdmin.strings.gradientMaxColorStops
              ? window.maseAdmin.strings.gradientMaxColorStops
              : 'Maximum 10 color stops allowed';
          MASE.showNotice(message, 'warning');
        }
        return;
      }

      // Store index for accessibility event
      const newIndex = stopCount;

      // Calculate position for new stop
      const position = stopCount > 0 ? Math.round((100 / (stopCount + 1)) * stopCount) : 50;
      const index = stopCount;

      // Create new color stop HTML
      const $newStop = $(
        '<div class="mase-color-stop" data-index="' +
          index +
          '">' +
          '<div class="mase-color-stop-color">' +
          '<input type="text" ' +
          'name="custom_backgrounds[' +
          area +
          '][gradient_colors][' +
          index +
          '][color]" ' +
          'class="mase-color-picker" ' +
          'value="#667eea" ' +
          'data-default-color="#667eea" ' +
          'aria-label="Color stop ' +
          (index + 1) +
          ' color" />' +
          '</div>' +
          '<div class="mase-color-stop-position">' +
          '<input type="number" ' +
          'name="custom_backgrounds[' +
          area +
          '][gradient_colors][' +
          index +
          '][position]" ' +
          'class="mase-stop-position" ' +
          'value="' +
          position +
          '" ' +
          'min="0" ' +
          'max="100" ' +
          'step="1" ' +
          'aria-label="Color stop ' +
          (index + 1) +
          ' position" />' +
          '<span class="mase-input-suffix">%</span>' +
          '</div>' +
          '<button type="button" ' +
          'class="button button-link-delete mase-remove-color-stop" ' +
          'data-area="' +
          area +
          '" ' +
          'aria-label="Remove color stop ' +
          (index + 1) +
          '">' +
          '<span class="dashicons dashicons-no-alt" aria-hidden="true"></span>' +
          '</button>' +
          '</div>',
      );

      // Append to container
      $container.append($newStop);

      // Initialize color picker for new stop
      $newStop.find('.mase-color-picker').wpColorPicker({
        change: (event, ui) => {
          this.updatePreviewDebounced(area);
        },
        clear: (event) => {
          this.updatePreviewDebounced(area);
        },
      });

      // Update button states
      this.updateColorStopButtons(area);

      // Trigger accessibility event
      $(document).trigger('mase:colorStopAdded', [{ area: area, index: newIndex }]);

      // Update preview
      this.updatePreview(area);
    },

    /**
     * Reindex color stops after removal
     */
    reindexColorStops: function (area) {
      const $container = $('.mase-gradient-color-stops[data-area="' + area + '"]');

      $container.find('.mase-color-stop').each(function (index) {
        const $stop = $(this);
        $stop.attr('data-index', index);

        // Update input names
        $stop
          .find('.mase-color-picker')
          .attr('name', 'custom_backgrounds[' + area + '][gradient_colors][' + index + '][color]');
        $stop
          .find('.mase-stop-position')
          .attr(
            'name',
            'custom_backgrounds[' + area + '][gradient_colors][' + index + '][position]',
          );

        // Update aria labels
        $stop.find('.mase-color-picker').attr('aria-label', 'Color stop ' + (index + 1) + ' color');
        $stop
          .find('.mase-stop-position')
          .attr('aria-label', 'Color stop ' + (index + 1) + ' position');
        $stop
          .find('.mase-remove-color-stop')
          .attr('aria-label', 'Remove color stop ' + (index + 1));
      });
    },

    /**
     * Update color stop button states (enable/disable)
     */
    updateColorStopButtons: function (area) {
      const $container = $('.mase-gradient-color-stops[data-area="' + area + '"]');
      const $stops = $container.find('.mase-color-stop');
      const stopCount = $stops.length;

      // Update remove buttons (disable if only 2 stops)
      $stops.find('.mase-remove-color-stop').prop('disabled', stopCount <= 2);

      // Update add button (disable if 10 stops)
      $('.mase-add-color-stop[data-area="' + area + '"]').prop('disabled', stopCount >= 10);
    },

    /**
     * Update gradient preview
     */
    updatePreview: function (area) {
      const config = this.getGradientConfig(area);
      const css = this.generateGradientCSS(config);

      // Update preview box
      $('.mase-gradient-preview[data-area="' + area + '"]').css('background', css);

      // Update angle dial background
      $('.mase-gradient-angle-dial[data-area="' + area + '"]').css('background', css);

      // Trigger live preview if enabled
      if (window.MASE && window.MASE.livePreview && window.MASE.livePreview.enabled) {
        MASE.livePreview.updateBackground(area);
      }
    },

    /**
     * Debounced preview update (for input events)
     * Task 35: Use centralized debounce function
     */
    updatePreviewDebounced: function (area) {
      if (this.debouncedUpdatePreview) {
        this.debouncedUpdatePreview(area);
      } else {
        // Fallback to immediate update
        this.updatePreview(area);
      }
    },

    /**
     * Update all gradient previews on page load
     */
    updateAllPreviews: function () {
      const self = this;

      $('.mase-gradient-preview').each(function () {
        const area = $(this).data('area');
        if (area) {
          self.updatePreview(area);
        }
      });
    },

    /**
     * Get current gradient configuration for an area
     */
    getGradientConfig: function (area) {
      const $controls = $('.mase-background-gradient-controls[data-type="gradient"]').filter(
        function () {
          return $(this).closest('.mase-background-config').data('area') === area;
        },
      );

      const type = $controls.find('.mase-gradient-type').val() || 'linear';
      const angle = parseInt($controls.find('.mase-gradient-angle-input').val()) || 90;

      const colors = [];
      $controls.find('.mase-color-stop').each(function () {
        const $stop = $(this);
        const color = $stop.find('.mase-color-picker').val() || '#667eea';
        const position = parseInt($stop.find('.mase-stop-position').val()) || 0;

        colors.push({
          color: color,
          position: position,
        });
      });

      // Sort colors by position
      colors.sort((a, b) => a.position - b.position);

      return {
        type: type,
        angle: angle,
        colors: colors,
      };
    },

    /**
     * Generate CSS gradient string from configuration
     */
    generateGradientCSS: function (config) {
      // Validate colors
      if (!config.colors || config.colors.length < 2) {
        return 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
      }

      // Build color stops string
      const colorStops = config.colors
        .map((stop) => stop.color + ' ' + stop.position + '%')
        .join(', ');

      // Generate gradient based on type
      if (config.type === 'radial') {
        return 'radial-gradient(circle, ' + colorStops + ')';
      } else {
        return 'linear-gradient(' + config.angle + 'deg, ' + colorStops + ')';
      }
    },

    /**
     * Initialize gradient presets
     */
    initPresets: function () {
      const self = this;

      // Check if gradient presets are available
      if (!window.maseAdmin || !window.maseAdmin.gradientPresets) {
        console.warn('MASE: Gradient presets not available');
        return;
      }

      // Populate preset grids for each area
      $('.mase-gradient-preset-grid').each(function () {
        const $grid = $(this);
        const area = $grid.data('area');
        self.populatePresetGrid($grid, area);
      });

      // Category filter handler
      $('.mase-gradient-category-filter').on('change', function () {
        const $select = $(this);
        const category = $select.val();
        const area = $select.data('area');
        self.filterPresetsByCategory(area, category);
      });

      // Preset click handler
      $(document).on('click', '.mase-gradient-preset-item', function (e) {
        e.preventDefault();

        const $item = $(this);
        const presetId = $item.data('preset-id');
        const category = $item.data('category');
        const area = $item.closest('.mase-gradient-preset-grid').data('area');

        self.applyPreset(area, category, presetId);
      });
    },

    /**
     * Populate preset grid with gradient presets
     */
    populatePresetGrid: function ($grid, area) {
      const presets = window.maseAdmin.gradientPresets;
      $grid.empty();

      // Iterate through categories
      $.each(presets, (category, categoryPresets) => {
        // Iterate through presets in category
        $.each(categoryPresets, (presetId, preset) => {
          const gradientCSS = this.generateGradientCSS({
            type: preset.type,
            angle: preset.angle,
            colors: preset.colors,
          });

          const $item = $('<div>', {
            class: 'mase-gradient-preset-item',
            'data-preset-id': presetId,
            'data-category': category,
            role: 'button',
            tabindex: '0',
            'aria-label': preset.name,
          });

          const $preview = $('<div>', {
            class: 'mase-gradient-preset-preview',
            css: {
              background: gradientCSS,
            },
          });

          const $name = $('<div>', {
            class: 'mase-gradient-preset-name',
            text: preset.name,
          });

          $item.append($preview, $name);
          $grid.append($item);
        });
      });

      // Add keyboard support
      $grid.find('.mase-gradient-preset-item').on('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          $(this).click();
        }
      });
    },

    /**
     * Filter presets by category
     */
    filterPresetsByCategory: function (area, category) {
      const $grid = $('.mase-gradient-preset-grid[data-area="' + area + '"]');
      const $items = $grid.find('.mase-gradient-preset-item');

      if (category === 'all') {
        $items.removeClass('hidden').show();
      } else {
        $items.each(function () {
          const $item = $(this);
          if ($item.data('category') === category) {
            $item.removeClass('hidden').show();
          } else {
            $item.addClass('hidden').hide();
          }
        });
      }
    },

    /**
     * Apply gradient preset
     */
    applyPreset: function (area, category, presetId) {
      const presets = window.maseAdmin.gradientPresets;

      // Get preset data
      if (!presets[category] || !presets[category][presetId]) {
        console.error('MASE: Preset not found:', category, presetId);
        return;
      }

      const preset = presets[category][presetId];

      // Find the gradient controls for this area
      const $controls = $('.mase-background-gradient-controls').filter(function () {
        return $(this).closest('.mase-background-config').data('area') === area;
      });

      if ($controls.length === 0) {
        console.error('MASE: Gradient controls not found for area:', area);
        return;
      }

      // Update gradient type
      $controls.find('.mase-gradient-type').val(preset.type).trigger('change');

      // Update angle (for linear gradients)
      if (preset.type === 'linear') {
        $controls.find('.mase-gradient-angle-input').val(preset.angle).trigger('change');
      }

      // Clear existing color stops
      $controls.find('.mase-gradient-color-stops .mase-color-stop').remove();

      // Add preset color stops
      const $colorStopsContainer = $controls.find('.mase-gradient-color-stops');
      preset.colors.forEach((stop, index) => {
        this.addColorStopWithValues(area, stop.color, stop.position, $colorStopsContainer);
      });

      // Update button states
      this.updateColorStopButtons(area);

      // Highlight selected preset
      const $grid = $('.mase-gradient-preset-grid[data-area="' + area + '"]');
      $grid.find('.mase-gradient-preset-item').removeClass('selected');
      $grid
        .find('.mase-gradient-preset-item[data-preset-id="' + presetId + '"]')
        .addClass('selected');

      // Update preview
      this.updatePreview(area);

      // Show success message
      if (window.MASE && window.MASE.showNotice) {
        MASE.showNotice('Gradient preset "' + preset.name + '" applied', 'success');
      }
    },

    /**
     * Add color stop with specific values (used by preset application)
     */
    addColorStopWithValues: function (area, color, position, $container) {
      const $stops = $container.find('.mase-color-stop');
      const index = $stops.length;

      // Create new color stop HTML
      const $newStop = $(
        '<div class="mase-color-stop" data-index="' +
          index +
          '">' +
          '<div class="mase-color-stop-color">' +
          '<input type="text" ' +
          'name="custom_backgrounds[' +
          area +
          '][gradient_colors][' +
          index +
          '][color]" ' +
          'class="mase-color-picker" ' +
          'value="' +
          color +
          '" ' +
          'data-default-color="' +
          color +
          '" ' +
          'aria-label="Color stop ' +
          (index + 1) +
          ' color" />' +
          '</div>' +
          '<div class="mase-color-stop-position">' +
          '<input type="number" ' +
          'name="custom_backgrounds[' +
          area +
          '][gradient_colors][' +
          index +
          '][position]" ' +
          'class="mase-stop-position" ' +
          'value="' +
          position +
          '" ' +
          'min="0" ' +
          'max="100" ' +
          'step="1" ' +
          'aria-label="Color stop ' +
          (index + 1) +
          ' position" />' +
          '<span class="mase-input-suffix">%</span>' +
          '</div>' +
          '<button type="button" ' +
          'class="button button-link-delete mase-remove-color-stop" ' +
          'data-area="' +
          area +
          '" ' +
          'aria-label="Remove color stop ' +
          (index + 1) +
          '">' +
          '<span class="dashicons dashicons-no-alt" aria-hidden="true"></span>' +
          '</button>' +
          '</div>',
      );

      // Append to container
      $container.append($newStop);

      // Initialize color picker for new stop
      $newStop.find('.mase-color-picker').wpColorPicker({
        change: (event, ui) => {
          this.updatePreviewDebounced(area);
        },
        clear: (event) => {
          this.updatePreviewDebounced(area);
        },
      });
    },
  };

  // Initialize on document ready
  $(document).ready(function () {
    MASE.gradientBuilder.init();
  });
})(jQuery);
