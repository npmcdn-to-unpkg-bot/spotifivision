/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.7'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.7
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.7'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector === '#' ? [] : selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.7
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.7'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d).prop(d, true)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d).prop(d, false)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target).closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
        // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
        e.preventDefault()
        // The target component still receive the focus
        if ($btn.is('input,button')) $btn.trigger('focus')
        else $btn.find('input:visible,button:visible').first().trigger('focus')
      }
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.7'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.7'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.7'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.7'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (document !== e.target &&
            this.$element[0] !== e.target &&
            !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.7'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.7'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.7'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.7'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
      }
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset  = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset())
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
      that.$element = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.7
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.7'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector === '#' ? [] : selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.7
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.7'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d).prop(d, true)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d).prop(d, false)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target).closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
        // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
        e.preventDefault()
        // The target component still receive the focus
        if ($btn.is('input,button')) $btn.trigger('focus')
        else $btn.find('input:visible,button:visible').first().trigger('focus')
      }
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.7'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.7'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.7'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.7'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (document !== e.target &&
            this.$element[0] !== e.target &&
            !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.7'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
      }
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset  = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset())
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
      that.$element = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.7'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.7'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.7'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.7'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";var b=a.fn.jquery.split(" ")[0].split(".");if(b[0]<2&&b[1]<9||1==b[0]&&9==b[1]&&b[2]<1||b[0]>3)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4")}(jQuery),+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){if(a(b.target).is(this))return b.handleObj.handler.apply(this,arguments)}})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.3.7",d.TRANSITION_DURATION=150,d.prototype.close=function(b){function c(){g.detach().trigger("closed.bs.alert").remove()}var e=a(this),f=e.attr("data-target");f||(f=e.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,""));var g=a("#"===f?[]:f);b&&b.preventDefault(),g.length||(g=e.closest(".alert")),g.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(g.removeClass("in"),a.support.transition&&g.hasClass("fade")?g.one("bsTransitionEnd",c).emulateTransitionEnd(d.TRANSITION_DURATION):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.3.7",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),setTimeout(a.proxy(function(){d[e](null==f[b]?this.options[b]:f[b]),"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c).prop(c,!0)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c).prop(c,!1))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")?(c.prop("checked")&&(a=!1),b.find(".active").removeClass("active"),this.$element.addClass("active")):"checkbox"==c.prop("type")&&(c.prop("checked")!==this.$element.hasClass("active")&&(a=!1),this.$element.toggleClass("active")),c.prop("checked",this.$element.hasClass("active")),a&&c.trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target).closest(".btn");b.call(d,"toggle"),a(c.target).is('input[type="radio"], input[type="checkbox"]')||(c.preventDefault(),d.is("input,button")?d.trigger("focus"):d.find("input:visible,button:visible").first().trigger("focus"))}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(b){a(b.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(b.type))})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",a.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.3.7",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(a){if(!/input|textarea/i.test(a.target.tagName)){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()}},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.getItemForDirection=function(a,b){var c=this.getItemIndex(b),d="prev"==a&&0===c||"next"==a&&c==this.$items.length-1;if(d&&!this.options.wrap)return b;var e="prev"==a?-1:1,f=(c+e)%this.$items.length;return this.$items.eq(f)},c.prototype.to=function(a){var b=this,c=this.getItemIndex(this.$active=this.$element.find(".item.active"));if(!(a>this.$items.length-1||a<0))return this.sliding?this.$element.one("slid.bs.carousel",function(){b.to(a)}):c==a?this.pause().cycle():this.slide(a>c?"next":"prev",this.$items.eq(a))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){if(!this.sliding)return this.slide("next")},c.prototype.prev=function(){if(!this.sliding)return this.slide("prev")},c.prototype.slide=function(b,d){var e=this.$element.find(".item.active"),f=d||this.getItemForDirection(b,e),g=this.interval,h="next"==b?"left":"right",i=this;if(f.hasClass("active"))return this.sliding=!1;var j=f[0],k=a.Event("slide.bs.carousel",{relatedTarget:j,direction:h});if(this.$element.trigger(k),!k.isDefaultPrevented()){if(this.sliding=!0,g&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var l=a(this.$indicators.children()[this.getItemIndex(f)]);l&&l.addClass("active")}var m=a.Event("slid.bs.carousel",{relatedTarget:j,direction:h});return a.support.transition&&this.$element.hasClass("slide")?(f.addClass(b),f[0].offsetWidth,e.addClass(h),f.addClass(h),e.one("bsTransitionEnd",function(){f.removeClass([b,h].join(" ")).addClass("active"),e.removeClass(["active",h].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger(m)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(e.removeClass("active"),f.addClass("active"),this.sliding=!1,this.$element.trigger(m)),g&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this};var e=function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}};a(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){"use strict";function b(b){var c,d=b.attr("data-target")||(c=b.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"");return a(d)}function c(b){return this.each(function(){var c=a(this),e=c.data("bs.collapse"),f=a.extend({},d.DEFAULTS,c.data(),"object"==typeof b&&b);!e&&f.toggle&&/show|hide/.test(b)&&(f.toggle=!1),e||c.data("bs.collapse",e=new d(this,f)),"string"==typeof b&&e[b]()})}var d=function(b,c){this.$element=a(b),this.options=a.extend({},d.DEFAULTS,c),this.$trigger=a('[data-toggle="collapse"][href="#'+b.id+'"],[data-toggle="collapse"][data-target="#'+b.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};d.VERSION="3.3.7",d.TRANSITION_DURATION=350,d.DEFAULTS={toggle:!0},d.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},d.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(b=e.data("bs.collapse"),b&&b.transitioning))){var f=a.Event("show.bs.collapse");if(this.$element.trigger(f),!f.isDefaultPrevented()){e&&e.length&&(c.call(e,"hide"),b||e.data("bs.collapse",null));var g=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var h=function(){this.$element.removeClass("collapsing").addClass("collapse in")[g](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return h.call(this);var i=a.camelCase(["scroll",g].join("-"));this.$element.one("bsTransitionEnd",a.proxy(h,this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])}}}},d.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var e=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(e,this)).emulateTransitionEnd(d.TRANSITION_DURATION):e.call(this)}}},d.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},d.prototype.getParent=function(){return a(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(c,d){var e=a(d);this.addAriaAndCollapsedClass(b(e),e)},this)).end()},d.prototype.addAriaAndCollapsedClass=function(a,b){var c=a.hasClass("in");a.attr("aria-expanded",c),b.toggleClass("collapsed",!c).attr("aria-expanded",c)};var e=a.fn.collapse;a.fn.collapse=c,a.fn.collapse.Constructor=d,a.fn.collapse.noConflict=function(){return a.fn.collapse=e,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(d){var e=a(this);e.attr("data-target")||d.preventDefault();var f=b(e),g=f.data("bs.collapse"),h=g?"toggle":e.data();c.call(f,h)})}(jQuery),+function(a){"use strict";function b(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function c(c){c&&3===c.which||(a(e).remove(),a(f).each(function(){var d=a(this),e=b(d),f={relatedTarget:this};e.hasClass("open")&&(c&&"click"==c.type&&/input|textarea/i.test(c.target.tagName)&&a.contains(e[0],c.target)||(e.trigger(c=a.Event("hide.bs.dropdown",f)),c.isDefaultPrevented()||(d.attr("aria-expanded","false"),e.removeClass("open").trigger(a.Event("hidden.bs.dropdown",f)))))}))}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.3.7",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=b(e),g=f.hasClass("open");if(c(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click",c);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),f.toggleClass("open").trigger(a.Event("shown.bs.dropdown",h))}return!1}},g.prototype.keydown=function(c){if(/(38|40|27|32)/.test(c.which)&&!/input|textarea/i.test(c.target.tagName)){var d=a(this);if(c.preventDefault(),c.stopPropagation(),!d.is(".disabled, :disabled")){var e=b(d),g=e.hasClass("open");if(!g&&27!=c.which||g&&27==c.which)return 27==c.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.disabled):visible a",i=e.find(".dropdown-menu"+h);if(i.length){var j=i.index(c.target);38==c.which&&j>0&&j--,40==c.which&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",c).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f,g.prototype.keydown).on("keydown.bs.dropdown.data-api",".dropdown-menu",g.prototype.keydown)}(jQuery),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.3.7",c.TRANSITION_DURATION=300,c.BACKDROP_TRANSITION_DURATION=150,c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var d=this,e=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){d.$element.one("mouseup.dismiss.bs.modal",function(b){a(b.target).is(d.$element)&&(d.ignoreBackdropClick=!0)})}),this.backdrop(function(){var e=a.support.transition&&d.$element.hasClass("fade");d.$element.parent().length||d.$element.appendTo(d.$body),d.$element.show().scrollTop(0),d.adjustDialog(),e&&d.$element[0].offsetWidth,d.$element.addClass("in"),d.enforceFocus();var f=a.Event("shown.bs.modal",{relatedTarget:b});e?d.$dialog.one("bsTransitionEnd",function(){d.$element.trigger("focus").trigger(f)}).emulateTransitionEnd(c.TRANSITION_DURATION):d.$element.trigger("focus").trigger(f)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(c.TRANSITION_DURATION):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){document===a.target||this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},c.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$body.removeClass("modal-open"),a.resetAdjustments(),a.resetScrollbar(),a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var d=this,e=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var f=a.support.transition&&e;if(this.$backdrop=a(document.createElement("div")).addClass("modal-backdrop "+e).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){return this.ignoreBackdropClick?void(this.ignoreBackdropClick=!1):void(a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide()))},this)),f&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;f?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var g=function(){d.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):g()}else b&&b()},c.prototype.handleUpdate=function(){this.adjustDialog()},c.prototype.adjustDialog=function(){var a=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&a?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!a?this.scrollbarWidth:""})},c.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},c.prototype.checkScrollbar=function(){var a=window.innerWidth;if(!a){var b=document.documentElement.getBoundingClientRect();a=b.right-Math.abs(b.left)}this.bodyIsOverflowing=document.body.clientWidth<a,this.scrollbarWidth=this.measureScrollbar()},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b;!e&&/destroy|hide/.test(b)||(e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.inState=null,this.init("tooltip",a,b)};c.VERSION="3.3.7",c.TRANSITION_DURATION=150,c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){if(this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(a.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusin"==b.type?"focus":"hover"]=!0),c.tip().hasClass("in")||"in"==c.hoverState?void(c.hoverState="in"):(clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show())},c.prototype.isInStateTrue=function(){for(var a in this.inState)if(this.inState[a])return!0;return!1},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);if(c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusout"==b.type?"focus":"hover"]=!1),!c.isInStateTrue())return clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide()},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var d=a.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!d)return;var e=this,f=this.tip(),g=this.getUID(this.type);this.setContent(),f.attr("id",g),this.$element.attr("aria-describedby",g),this.options.animation&&f.addClass("fade");var h="function"==typeof this.options.placement?this.options.placement.call(this,f[0],this.$element[0]):this.options.placement,i=/\s?auto?\s?/i,j=i.test(h);j&&(h=h.replace(i,"")||"top"),f.detach().css({top:0,left:0,display:"block"}).addClass(h).data("bs."+this.type,this),this.options.container?f.appendTo(this.options.container):f.insertAfter(this.$element),this.$element.trigger("inserted.bs."+this.type);var k=this.getPosition(),l=f[0].offsetWidth,m=f[0].offsetHeight;if(j){var n=h,o=this.getPosition(this.$viewport);h="bottom"==h&&k.bottom+m>o.bottom?"top":"top"==h&&k.top-m<o.top?"bottom":"right"==h&&k.right+l>o.width?"left":"left"==h&&k.left-l<o.left?"right":h,f.removeClass(n).addClass(h)}var p=this.getCalculatedOffset(h,k,l,m);this.applyPlacement(p,h);var q=function(){var a=e.hoverState;e.$element.trigger("shown.bs."+e.type),e.hoverState=null,"out"==a&&e.leave(e)};a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",q).emulateTransitionEnd(c.TRANSITION_DURATION):q()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top+=g,b.left+=h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=/top|bottom/.test(c),m=l?2*k.left-e+i:2*k.top-f+j,n=l?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(m,d[0][n],l)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c?"left":"top",50*(1-a/b)+"%").css(c?"top":"left","")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(b){function d(){"in"!=e.hoverState&&f.detach(),e.$element&&e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),b&&b()}var e=this,f=a(this.$tip),g=a.Event("hide.bs."+this.type);if(this.$element.trigger(g),!g.isDefaultPrevented())return f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one("bsTransitionEnd",d).emulateTransitionEnd(c.TRANSITION_DURATION):d(),this.hoverState=null,this},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName,e=c.getBoundingClientRect();null==e.width&&(e=a.extend({},e,{width:e.right-e.left,height:e.bottom-e.top}));var f=window.SVGElement&&c instanceof window.SVGElement,g=d?{top:0,left:0}:f?null:b.offset(),h={scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop()},i=d?{width:a(window).width(),height:a(window).height()}:null;return a.extend({},e,h,i,g)},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.right&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){if(!this.$tip&&(this.$tip=a(this.options.template),1!=this.$tip.length))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),b?(c.inState.click=!c.inState.click,c.isInStateTrue()?c.enter(c):c.leave(c)):c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){var a=this;clearTimeout(this.timeout),this.hide(function(){a.$element.off("."+a.type).removeData("bs."+a.type),a.$tip&&a.$tip.detach(),a.$tip=null,a.$arrow=null,a.$viewport=null,a.$element=null})};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b;!e&&/destroy|hide/.test(b)||(e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.3.7",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").children().detach().end()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){"use strict";function b(c,d){this.$body=a(document.body),this.$scrollElement=a(a(c).is(document.body)?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",a.proxy(this.process,this)),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.3.7",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b=this,c="offset",d=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),a.isWindow(this.$scrollElement[0])||(c="position",d=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var b=a(this),e=b.data("target")||b.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[c]().top+d,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){b.offsets.push(this[0]),b.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<e[0])return this.activeTarget=null,this.clear();for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(void 0===e[a+1]||b<e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){
this.activeTarget=b,this.clear();var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")},b.prototype.clear=function(){a(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.3.7",c.TRANSITION_DURATION=150,c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a"),f=a.Event("hide.bs.tab",{relatedTarget:b[0]}),g=a.Event("show.bs.tab",{relatedTarget:e[0]});if(e.trigger(f),b.trigger(g),!g.isDefaultPrevented()&&!f.isDefaultPrevented()){var h=a(d);this.activate(b.closest("li"),c),this.activate(h,h.parent(),function(){e.trigger({type:"hidden.bs.tab",relatedTarget:b[0]}),b.trigger({type:"shown.bs.tab",relatedTarget:e[0]})})}}},c.prototype.activate=function(b,d,e){function f(){g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),h?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu").length&&b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),e&&e()}var g=d.find("> .active"),h=e&&a.support.transition&&(g.length&&g.hasClass("fade")||!!d.find("> .fade").length);g.length&&h?g.one("bsTransitionEnd",f).emulateTransitionEnd(c.TRANSITION_DURATION):f(),g.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this};var e=function(c){c.preventDefault(),b.call(a(this),"show")};a(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',e).on("click.bs.tab.data-api",'[data-toggle="pill"]',e)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.3.7",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getState=function(a,b,c,d){var e=this.$target.scrollTop(),f=this.$element.offset(),g=this.$target.height();if(null!=c&&"top"==this.affixed)return e<c&&"top";if("bottom"==this.affixed)return null!=c?!(e+this.unpin<=f.top)&&"bottom":!(e+g<=a-d)&&"bottom";var h=null==this.affixed,i=h?e:f.top,j=h?g:b;return null!=c&&e<=c?"top":null!=d&&i+j>=a-d&&"bottom"},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=this.$element.height(),d=this.options.offset,e=d.top,f=d.bottom,g=Math.max(a(document).height(),a(document.body).height());"object"!=typeof d&&(f=e=d),"function"==typeof e&&(e=d.top(this.$element)),"function"==typeof f&&(f=d.bottom(this.$element));var h=this.getState(g,b,e,f);if(this.affixed!=h){null!=this.unpin&&this.$element.css("top","");var i="affix"+(h?"-"+h:""),j=a.Event(i+".bs.affix");if(this.$element.trigger(j),j.isDefaultPrevented())return;this.affixed=h,this.unpin="bottom"==h?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix","affixed")+".bs.affix")}"bottom"==h&&this.$element.offset({top:g-b-f})}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},null!=d.offsetBottom&&(d.offset.bottom=d.offsetBottom),null!=d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery);
// This file is autogenerated via the `commonjs` Grunt task. You can require() this file in a CommonJS environment.
require('../../js/transition.js')
require('../../js/alert.js')
require('../../js/button.js')
require('../../js/carousel.js')
require('../../js/collapse.js')
require('../../js/dropdown.js')
require('../../js/modal.js')
require('../../js/tooltip.js')
require('../../js/popover.js')
require('../../js/scrollspy.js')
require('../../js/tab.js')
require('../../js/affix.js')
/**
 *
 * Creator of typical test AnimationClips / KeyframeTracks
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 */

THREE.AnimationClipCreator = function() {
};

THREE.AnimationClipCreator.CreateRotationAnimation = function( period, axis ) {

	var times = [ 0, period ], values = [ 0, 360 ];

	axis = axis || 'x';
	var trackName = '.rotation[' + axis + ']';

	var track = new THREE.NumberKeyframeTrack( trackName, times, values );

	return new THREE.AnimationClip( null, period, [ track ] );

};

THREE.AnimationClipCreator.CreateScaleAxisAnimation = function( period, axis ) {

	var times = [ 0, period ], values = [ 0, 1 ];

	axis = axis || 'x';
	var trackName = '.scale[' + axis + ']';

	var track = new THREE.NumberKeyframeTrack( trackName, times, values );

	return new THREE.AnimationClip( null, period, [ track ] );

};

THREE.AnimationClipCreator.CreateShakeAnimation = function( duration, shakeScale ) {

	var times = [], values = [], tmp = new THREE.Vector3();

	for( var i = 0; i < duration * 10; i ++ ) {

		times.push( i / 10 );

		tmp.set( Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0 ).
			multiply( shakeScale ).
			toArray( values, values.length );

	}

	var trackName = '.position';

	var track = new THREE.VectorKeyframeTrack( trackName, times, values );

	return new THREE.AnimationClip( null, duration, [ track ] );

};


THREE.AnimationClipCreator.CreatePulsationAnimation = function( duration, pulseScale ) {

	var times = [], values = [], tmp = new THREE.Vector3();

	for( var i = 0; i < duration * 10; i ++ ) {

		times.push( i / 10 );

		var scaleFactor = Math.random() * pulseScale;
		tmp.set( scaleFactor, scaleFactor, scaleFactor ).
			toArray( values, values.length );

	}

	var trackName = '.scale';

	var track = new THREE.VectorKeyframeTrack( trackName, keys );

	return new THREE.AnimationClip( null, duration, [ track ] );

};


THREE.AnimationClipCreator.CreateVisibilityAnimation = function( duration ) {

	var times = [ 0, duration / 2, duration ], values = [ true, false, true ];

	var trackName = '.visible';

	var track = new THREE.BooleanKeyframeTrack( trackName, times, values );

	return new THREE.AnimationClip( null, duration, [ track ] );

};


THREE.AnimationClipCreator.CreateMaterialColorAnimation = function( duration, colors, loop ) {

	var times = [], values = [],
		timeStep = duration / colors.length;

	for( var i = 0; i <= colors.length; i ++ ) {

		timees.push( i * timeStep );
		values.push( colors[ i % colors.length ] );

	}

	var trackName = '.material[0].color';

	var track = new THREE.ColorKeyframeTrack( trackName, times, values );

	return new THREE.AnimationClip( null, duration, [ track ] );

};

/**
 * @author Michael Guerrero / http://realitymeltdown.com
 */

THREE.BlendCharacter = function () {

	this.weightSchedule = [];
	this.warpSchedule = [];

	this.load = function ( url, onLoad ) {

		var scope = this;

		var loader = new THREE.ObjectLoader();
		loader.load( url, function( loadedObject ) {

			// The exporter does not currently allow exporting a skinned mesh by itself
			// so we must fish it out of the hierarchy it is embedded in (scene)
			loadedObject.traverse( function( object ) {

				if ( object instanceof THREE.SkinnedMesh ) {

					scope.skinnedMesh = object;

				}

			} );

			THREE.SkinnedMesh.call( scope, scope.skinnedMesh.geometry, scope.skinnedMesh.material );

			// If we didn't successfully find the mesh, bail out
			if ( scope.skinnedMesh == undefined ) {

				console.log( 'unable to find skinned mesh in ' + url );
				return;

			}

			scope.material.skinning = true;

			scope.mixer = new THREE.AnimationMixer( scope );
			scope.mixer = scope.mixer;

			// Create the animations
			for ( var i = 0; i < scope.geometry.animations.length; ++ i ) {

				scope.mixer.clipAction( scope.geometry.animations[ i ] );

			}

			// Loading is complete, fire the callback
			if ( onLoad !== undefined ) onLoad();

		} );

	};

	this.loadJSON = function ( url, onLoad ) {

		var scope = this;

		var loader = new THREE.JSONLoader();
		loader.load( url, function( geometry, materials ) {

			var originalMaterial = materials[ 0 ];
			originalMaterial.skinning = true;

			THREE.SkinnedMesh.call( scope, geometry, originalMaterial );

			var mixer = new THREE.AnimationMixer( scope );
			scope.mixer = mixer;

			// Create the animations
			for ( var i = 0; i < geometry.animations.length; ++ i ) {

				mixer.clipAction( geometry.animations[ i ] );

			}

			// Loading is complete, fire the callback
			if ( onLoad !== undefined ) onLoad();

		} );

	};
	
	this.update = function( dt ) {

		this.mixer.update( dt );

	};

	this.play = function( animName, weight ) {

		//console.log("play('%s', %f)", animName, weight);
		return this.mixer.clipAction( animName ).
				setEffectiveWeight( weight ).play();
	};

	this.crossfade = function( fromAnimName, toAnimName, duration ) {

		this.mixer.stopAllAction();

		var fromAction = this.play( fromAnimName, 1 );
		var toAction = this.play( toAnimName, 1 );

		fromAction.crossFadeTo( toAction, duration, false );

	};

	this.warp = function( fromAnimName, toAnimName, duration ) {

		this.mixer.stopAllAction();

		var fromAction = this.play( fromAnimName, 1 );
		var toAction = this.play( toAnimName, 1 );

		fromAction.crossFadeTo( toAction, duration, true );

	};

	this.applyWeight = function( animName, weight ) {

		this.mixer.clipAction( animName ).setEffectiveWeight( weight );

	};

	this.getWeight = function( animName ) {

		return this.mixer.clipAction( animName ).getEffectiveWeight();

	}

	this.pauseAll = function() {

		this.mixer.timeScale = 0;

	};

	this.unPauseAll = function() {

		this.mixer.timeScale = 1;

	};


	this.stopAll = function() {

		this.mixer.stopAllAction();

	};

	this.showModel = function( boolean ) {

		this.visible = boolean;

	}

};


THREE.BlendCharacter.prototype = Object.create( THREE.SkinnedMesh.prototype );
THREE.BlendCharacter.prototype.constructor = THREE.BlendCharacter;

THREE.BlendCharacter.prototype.getForward = function() {

	var forward = new THREE.Vector3();

	return function() {

		// pull the character's forward basis vector out of the matrix
		forward.set(
			- this.matrix.elements[ 8 ],
			- this.matrix.elements[ 9 ],
			- this.matrix.elements[ 10 ]
		);

		return forward;

	}

};


/**
 * @author Michael Guerrero / http://realitymeltdown.com
 */

function BlendCharacterGui( blendMesh ) {

	var controls = {

		gui: null,
		"Show Model": true,
		"Show Skeleton": false,
		"Time Scale": 1.0,
		"Step Size": 0.016,
		"Crossfade Time": 3.5,
		"idle": 0.33,
		"walk": 0.33,
		"run": 0.33

	};

	var blendMesh = blendMesh;

	this.showModel = function() {

		return controls[ 'Show Model' ];

	};

	this.showSkeleton = function() {

		return controls[ 'Show Skeleton' ];

	};

	this.getTimeScale = function() {

		return controls[ 'Time Scale' ];

	};

	this.update = function( time ) {

		controls[ 'idle' ] = blendMesh.getWeight( 'idle' );
		controls[ 'walk' ] = blendMesh.getWeight( 'walk' );
		controls[ 'run' ] = blendMesh.getWeight( 'run' );

	};

	var init = function() {

		controls.gui = new dat.GUI();

		var settings = controls.gui.addFolder( 'Settings' );
		var playback = controls.gui.addFolder( 'Playback' );
		var blending = controls.gui.addFolder( 'Blend Tuning' );

		settings.add( controls, "Show Model" ).onChange( controls.showModelChanged );
		settings.add( controls, "Show Skeleton" ).onChange( controls.showSkeletonChanged );
		settings.add( controls, "Time Scale", 0, 1, 0.01 );
		settings.add( controls, "Step Size", 0.01, 0.1, 0.01 );
		settings.add( controls, "Crossfade Time", 0.1, 6.0, 0.05 );

		// These controls execute functions
		playback.add( controls, "start" );
		playback.add( controls, "pause" );
		playback.add( controls, "step" );
		playback.add( controls, "idle to walk" );
		playback.add( controls, "walk to run" );
		playback.add( controls, "warp walk to run" );

		blending.add( controls, "idle", 0, 1, 0.01 ).listen().onChange( controls.weight );
		blending.add( controls, "walk", 0, 1, 0.01 ).listen().onChange( controls.weight );
		blending.add( controls, "run", 0, 1, 0.01 ).listen().onChange( controls.weight );

		settings.open();
		playback.open();
		blending.open();

	};

	var getAnimationData = function() {

		return {

			detail: {

				anims: [ "idle", "walk", "run" ],

				weights: [ controls[ 'idle' ],
						   controls[ 'walk' ],
						   controls[ 'run' ] ]
			}

		};

	};

	controls.start = function() {

		var startEvent = new CustomEvent( 'start-animation', getAnimationData() );
		window.dispatchEvent( startEvent );

	};

	controls.stop = function() {

		var stopEvent = new CustomEvent( 'stop-animation' );
		window.dispatchEvent( stopEvent );

	};

	controls.pause = function() {

		var pauseEvent = new CustomEvent( 'pause-animation' );
		window.dispatchEvent( pauseEvent );

	};

	controls.step = function() {

		var stepData = { detail: { stepSize: controls[ 'Step Size' ] } };
		window.dispatchEvent( new CustomEvent( 'step-animation', stepData ) );

	};

	controls.weight = function() {

		// renormalize
		var sum = controls[ 'idle' ] + controls[ 'walk' ] + controls[ 'run' ];
		controls[ 'idle' ] /= sum;
		controls[ 'walk' ] /= sum;
		controls[ 'run' ] /= sum;

		var weightEvent = new CustomEvent( 'weight-animation', getAnimationData() );
		window.dispatchEvent( weightEvent );

	};

	controls.crossfade = function( from, to ) {

		var fadeData = getAnimationData();
		fadeData.detail.from = from;
		fadeData.detail.to = to;
		fadeData.detail.time = controls[ "Crossfade Time" ];

		window.dispatchEvent( new CustomEvent( 'crossfade', fadeData ) );

	};

	controls.warp = function( from, to ) {

		var warpData = getAnimationData();
		warpData.detail.from = 'walk';
		warpData.detail.to = 'run';
		warpData.detail.time = controls[ "Crossfade Time" ];

		window.dispatchEvent( new CustomEvent( 'warp', warpData ) );

	};

	controls[ 'idle to walk' ] = function() {

		controls.crossfade( 'idle', 'walk' );

	};

	controls[ 'walk to run' ] = function() {

		controls.crossfade( 'walk', 'run' );

	};

	controls[ 'warp walk to run' ] = function() {

		controls.warp( 'walk', 'run' );

	};

	controls.showSkeletonChanged = function() {

		var data = {
			detail: {
				shouldShow: controls[ 'Show Skeleton' ]
			}
		};

		window.dispatchEvent( new CustomEvent( 'toggle-show-skeleton', data ) );

	};


	controls.showModelChanged = function() {

		var data = {
			detail: {
				shouldShow: controls[ 'Show Model' ]
			}
		};

		window.dispatchEvent( new CustomEvent( 'toggle-show-model', data ) );

	};


	init.call( this );

}

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.BufferGeometryUtils = {

	computeTangents: function ( geometry ) {

		var index = geometry.index;
		var attributes = geometry.attributes;

		// based on http://www.terathon.com/code/tangent.html
		// (per vertex tangents)

		if ( index === null ||
			 attributes.position === undefined ||
			 attributes.normal === undefined ||
			 attributes.uv === undefined ) {

			console.warn( 'THREE.BufferGeometry: Missing required attributes (index, position, normal or uv) in BufferGeometry.computeTangents()' );
			return;

		}

		var indices = index.array;
		var positions = attributes.position.array;
		var normals = attributes.normal.array;
		var uvs = attributes.uv.array;

		var nVertices = positions.length / 3;

		if ( attributes.tangent === undefined ) {

			geometry.addAttribute( 'tangent', new THREE.BufferAttribute( new Float32Array( 4 * nVertices ), 4 ) );

		}

		var tangents = attributes.tangent.array;

		var tan1 = [], tan2 = [];

		for ( var k = 0; k < nVertices; k ++ ) {

			tan1[ k ] = new THREE.Vector3();
			tan2[ k ] = new THREE.Vector3();

		}

		var vA = new THREE.Vector3(),
			vB = new THREE.Vector3(),
			vC = new THREE.Vector3(),

			uvA = new THREE.Vector2(),
			uvB = new THREE.Vector2(),
			uvC = new THREE.Vector2(),

			sdir = new THREE.Vector3(),
			tdir = new THREE.Vector3();

		function handleTriangle( a, b, c ) {

			vA.fromArray( positions, a * 3 );
			vB.fromArray( positions, b * 3 );
			vC.fromArray( positions, c * 3 );

			uvA.fromArray( uvs, a * 2 );
			uvB.fromArray( uvs, b * 2 );
			uvC.fromArray( uvs, c * 2 );

			var x1 = vB.x - vA.x;
			var x2 = vC.x - vA.x;

			var y1 = vB.y - vA.y;
			var y2 = vC.y - vA.y;

			var z1 = vB.z - vA.z;
			var z2 = vC.z - vA.z;

			var s1 = uvB.x - uvA.x;
			var s2 = uvC.x - uvA.x;

			var t1 = uvB.y - uvA.y;
			var t2 = uvC.y - uvA.y;

			var r = 1.0 / ( s1 * t2 - s2 * t1 );

			sdir.set(
				( t2 * x1 - t1 * x2 ) * r,
				( t2 * y1 - t1 * y2 ) * r,
				( t2 * z1 - t1 * z2 ) * r
			);

			tdir.set(
				( s1 * x2 - s2 * x1 ) * r,
				( s1 * y2 - s2 * y1 ) * r,
				( s1 * z2 - s2 * z1 ) * r
			);

			tan1[ a ].add( sdir );
			tan1[ b ].add( sdir );
			tan1[ c ].add( sdir );

			tan2[ a ].add( tdir );
			tan2[ b ].add( tdir );
			tan2[ c ].add( tdir );

		}

		var groups = geometry.groups;

		if ( groups.length === 0 ) {

			groups = [ {
				start: 0,
				count: indices.length
			} ];

		}

		for ( var j = 0, jl = groups.length; j < jl; ++ j ) {

			var group = groups[ j ];

			var start = group.start;
			var count = group.count;

			for ( var i = start, il = start + count; i < il; i += 3 ) {

				handleTriangle(
					indices[ i + 0 ],
					indices[ i + 1 ],
					indices[ i + 2 ]
				);

			}

		}

		var tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();
		var n = new THREE.Vector3(), n2 = new THREE.Vector3();
		var w, t, test;

		function handleVertex( v ) {

			n.fromArray( normals, v * 3 );
			n2.copy( n );

			t = tan1[ v ];

			// Gram-Schmidt orthogonalize

			tmp.copy( t );
			tmp.sub( n.multiplyScalar( n.dot( t ) ) ).normalize();

			// Calculate handedness

			tmp2.crossVectors( n2, t );
			test = tmp2.dot( tan2[ v ] );
			w = ( test < 0.0 ) ? - 1.0 : 1.0;

			tangents[ v * 4 ] = tmp.x;
			tangents[ v * 4 + 1 ] = tmp.y;
			tangents[ v * 4 + 2 ] = tmp.z;
			tangents[ v * 4 + 3 ] = w;

		}

		for ( var j = 0, jl = groups.length; j < jl; ++ j ) {

			var group = groups[ j ];

			var start = group.start;
			var count = group.count;

			for ( var i = start, il = start + count; i < il; i += 3 ) {

				handleVertex( indices[ i + 0 ] );
				handleVertex( indices[ i + 1 ] );
				handleVertex( indices[ i + 2 ] );

			}

		}

	}

};

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Car = function () {

	var scope = this;

	// car geometry manual parameters

	this.modelScale = 1;

	this.backWheelOffset = 2;

	this.autoWheelGeometry = true;

	// car geometry parameters automatically set from wheel mesh
	// 	- assumes wheel mesh is front left wheel in proper global
	//    position with respect to body mesh
	//	- other wheels are mirrored against car root
	//	- if necessary back wheels can be offset manually

	this.wheelOffset = new THREE.Vector3();

	this.wheelDiameter = 1;

	// car "feel" parameters

	this.MAX_SPEED = 2200;
	this.MAX_REVERSE_SPEED = - 1500;

	this.MAX_WHEEL_ROTATION = 0.6;

	this.FRONT_ACCELERATION = 1250;
	this.BACK_ACCELERATION = 1500;

	this.WHEEL_ANGULAR_ACCELERATION = 1.5;

	this.FRONT_DECCELERATION = 750;
	this.WHEEL_ANGULAR_DECCELERATION = 1.0;

	this.STEERING_RADIUS_RATIO = 0.0023;

	this.MAX_TILT_SIDES = 0.05;
	this.MAX_TILT_FRONTBACK = 0.015;

	// internal control variables

	this.speed = 0;
	this.acceleration = 0;

	this.wheelOrientation = 0;
	this.carOrientation = 0;

	// car rigging

	this.root = new THREE.Object3D();

	this.frontLeftWheelRoot = new THREE.Object3D();
	this.frontRightWheelRoot = new THREE.Object3D();

	this.bodyMesh = null;

	this.frontLeftWheelMesh = null;
	this.frontRightWheelMesh = null;

	this.backLeftWheelMesh = null;
	this.backRightWheelMesh = null;

	this.bodyGeometry = null;
	this.wheelGeometry = null;

	this.bodyMaterials = null;
	this.wheelMaterials = null;

	// internal helper variables

	this.loaded = false;

	this.meshes = [];

	// API

	this.enableShadows = function ( enable ) {

		for ( var i = 0; i < this.meshes.length; i ++ ) {

			this.meshes[ i ].castShadow = enable;
			this.meshes[ i ].receiveShadow = enable;

		}

	};

	this.setVisible = function ( enable ) {

		for ( var i = 0; i < this.meshes.length; i ++ ) {

			this.meshes[ i ].visible = enable;
			this.meshes[ i ].visible = enable;

		}

	};

	this.loadPartsJSON = function ( bodyURL, wheelURL ) {

		var loader = new THREE.JSONLoader();

		loader.load( bodyURL, function( geometry, materials ) {

			createBody( geometry, materials )

		} );
		loader.load( wheelURL, function( geometry, materials ) {

			createWheels( geometry, materials )

		} );

	};

	this.loadPartsBinary = function ( bodyURL, wheelURL ) {

		var loader = new THREE.BinaryLoader();

		loader.load( bodyURL, function( geometry, materials ) {

			createBody( geometry, materials )

		} );
		loader.load( wheelURL, function( geometry, materials ) {

			createWheels( geometry, materials )

		} );

	};

	this.updateCarModel = function ( delta, controls ) {

		// speed and wheels based on controls

		if ( controls.moveForward ) {

			this.speed = THREE.Math.clamp( this.speed + delta * this.FRONT_ACCELERATION, this.MAX_REVERSE_SPEED, this.MAX_SPEED );
			this.acceleration = THREE.Math.clamp( this.acceleration + delta, - 1, 1 );

		}

		if ( controls.moveBackward ) {


			this.speed = THREE.Math.clamp( this.speed - delta * this.BACK_ACCELERATION, this.MAX_REVERSE_SPEED, this.MAX_SPEED );
			this.acceleration = THREE.Math.clamp( this.acceleration - delta, - 1, 1 );

		}

		if ( controls.moveLeft ) {

			this.wheelOrientation = THREE.Math.clamp( this.wheelOrientation + delta * this.WHEEL_ANGULAR_ACCELERATION, - this.MAX_WHEEL_ROTATION, this.MAX_WHEEL_ROTATION );

		}

		if ( controls.moveRight ) {

			this.wheelOrientation = THREE.Math.clamp( this.wheelOrientation - delta * this.WHEEL_ANGULAR_ACCELERATION, - this.MAX_WHEEL_ROTATION, this.MAX_WHEEL_ROTATION );

		}

		// speed decay

		if ( ! ( controls.moveForward || controls.moveBackward ) ) {

			if ( this.speed > 0 ) {

				var k = exponentialEaseOut( this.speed / this.MAX_SPEED );

				this.speed = THREE.Math.clamp( this.speed - k * delta * this.FRONT_DECCELERATION, 0, this.MAX_SPEED );
				this.acceleration = THREE.Math.clamp( this.acceleration - k * delta, 0, 1 );

			} else {

				var k = exponentialEaseOut( this.speed / this.MAX_REVERSE_SPEED );

				this.speed = THREE.Math.clamp( this.speed + k * delta * this.BACK_ACCELERATION, this.MAX_REVERSE_SPEED, 0 );
				this.acceleration = THREE.Math.clamp( this.acceleration + k * delta, - 1, 0 );

			}


		}

		// steering decay

		if ( ! ( controls.moveLeft || controls.moveRight ) ) {

			if ( this.wheelOrientation > 0 ) {

				this.wheelOrientation = THREE.Math.clamp( this.wheelOrientation - delta * this.WHEEL_ANGULAR_DECCELERATION, 0, this.MAX_WHEEL_ROTATION );

			} else {

				this.wheelOrientation = THREE.Math.clamp( this.wheelOrientation + delta * this.WHEEL_ANGULAR_DECCELERATION, - this.MAX_WHEEL_ROTATION, 0 );

			}

		}

		// car update

		var forwardDelta = this.speed * delta;

		this.carOrientation += ( forwardDelta * this.STEERING_RADIUS_RATIO ) * this.wheelOrientation;

		// displacement

		this.root.position.x += Math.sin( this.carOrientation ) * forwardDelta;
		this.root.position.z += Math.cos( this.carOrientation ) * forwardDelta;

		// steering

		this.root.rotation.y = this.carOrientation;

		// tilt

		if ( this.loaded ) {

			this.bodyMesh.rotation.z = this.MAX_TILT_SIDES * this.wheelOrientation * ( this.speed / this.MAX_SPEED );
			this.bodyMesh.rotation.x = - this.MAX_TILT_FRONTBACK * this.acceleration;

		}

		// wheels rolling

		var angularSpeedRatio = 1 / ( this.modelScale * ( this.wheelDiameter / 2 ) );

		var wheelDelta = forwardDelta * angularSpeedRatio;

		if ( this.loaded ) {

			this.frontLeftWheelMesh.rotation.x += wheelDelta;
			this.frontRightWheelMesh.rotation.x += wheelDelta;
			this.backLeftWheelMesh.rotation.x += wheelDelta;
			this.backRightWheelMesh.rotation.x += wheelDelta;

		}

		// front wheels steering

		this.frontLeftWheelRoot.rotation.y = this.wheelOrientation;
		this.frontRightWheelRoot.rotation.y = this.wheelOrientation;

	};

	// internal helper methods

	function createBody ( geometry, materials ) {

		scope.bodyGeometry = geometry;
		scope.bodyMaterials = materials;

		createCar();

	}

	function createWheels ( geometry, materials ) {

		scope.wheelGeometry = geometry;
		scope.wheelMaterials = materials;

		createCar();

	}

	function createCar () {

		if ( scope.bodyGeometry && scope.wheelGeometry ) {

			// compute wheel geometry parameters

			if ( scope.autoWheelGeometry ) {

				scope.wheelGeometry.computeBoundingBox();

				var bb = scope.wheelGeometry.boundingBox;

				scope.wheelOffset.addVectors( bb.min, bb.max );
				scope.wheelOffset.multiplyScalar( 0.5 );

				scope.wheelDiameter = bb.max.y - bb.min.y;

				scope.wheelGeometry.center();

			}

			// rig the car

			var s = scope.modelScale,
				delta = new THREE.Vector3();

			var bodyFaceMaterial = new THREE.MultiMaterial( scope.bodyMaterials );
			var wheelFaceMaterial = new THREE.MultiMaterial( scope.wheelMaterials );

			// body

			scope.bodyMesh = new THREE.Mesh( scope.bodyGeometry, bodyFaceMaterial );
			scope.bodyMesh.scale.set( s, s, s );

			scope.root.add( scope.bodyMesh );

			// front left wheel

			delta.multiplyVectors( scope.wheelOffset, new THREE.Vector3( s, s, s ) );

			scope.frontLeftWheelRoot.position.add( delta );

			scope.frontLeftWheelMesh = new THREE.Mesh( scope.wheelGeometry, wheelFaceMaterial );
			scope.frontLeftWheelMesh.scale.set( s, s, s );

			scope.frontLeftWheelRoot.add( scope.frontLeftWheelMesh );
			scope.root.add( scope.frontLeftWheelRoot );

			// front right wheel

			delta.multiplyVectors( scope.wheelOffset, new THREE.Vector3( - s, s, s ) );

			scope.frontRightWheelRoot.position.add( delta );

			scope.frontRightWheelMesh = new THREE.Mesh( scope.wheelGeometry, wheelFaceMaterial );

			scope.frontRightWheelMesh.scale.set( s, s, s );
			scope.frontRightWheelMesh.rotation.z = Math.PI;

			scope.frontRightWheelRoot.add( scope.frontRightWheelMesh );
			scope.root.add( scope.frontRightWheelRoot );

			// back left wheel

			delta.multiplyVectors( scope.wheelOffset, new THREE.Vector3( s, s, - s ) );
			delta.z -= scope.backWheelOffset;

			scope.backLeftWheelMesh = new THREE.Mesh( scope.wheelGeometry, wheelFaceMaterial );

			scope.backLeftWheelMesh.position.add( delta );
			scope.backLeftWheelMesh.scale.set( s, s, s );

			scope.root.add( scope.backLeftWheelMesh );

			// back right wheel

			delta.multiplyVectors( scope.wheelOffset, new THREE.Vector3( - s, s, - s ) );
			delta.z -= scope.backWheelOffset;

			scope.backRightWheelMesh = new THREE.Mesh( scope.wheelGeometry, wheelFaceMaterial );

			scope.backRightWheelMesh.position.add( delta );
			scope.backRightWheelMesh.scale.set( s, s, s );
			scope.backRightWheelMesh.rotation.z = Math.PI;

			scope.root.add( scope.backRightWheelMesh );

			// cache meshes

			scope.meshes = [ scope.bodyMesh, scope.frontLeftWheelMesh, scope.frontRightWheelMesh, scope.backLeftWheelMesh, scope.backRightWheelMesh ];

			// callback

			scope.loaded = true;

			if ( scope.callback ) {

				scope.callback( scope );

			}

		}

	}

	function quadraticEaseOut( k ) {

		return - k * ( k - 2 );

	}
	function cubicEaseOut( k ) {

		return -- k * k * k + 1;

	}
	function circularEaseOut( k ) {

		return Math.sqrt( 1 - -- k * k );

	}
	function sinusoidalEaseOut( k ) {

		return Math.sin( k * Math.PI / 2 );

	}
	function exponentialEaseOut( k ) {

		return k === 1 ? 1 : - Math.pow( 2, - 10 * k ) + 1;

	}

};

/*
 * Cloth Simulation using a relaxed constrains solver
 */

// Suggested Readings

// Advanced Character Physics by Thomas Jakobsen Character
// http://freespace.virgin.net/hugo.elias/models/m_cloth.htm
// http://en.wikipedia.org/wiki/Cloth_modeling
// http://cg.alexandra.dk/tag/spring-mass-system/
// Real-time Cloth Animation http://www.darwin3d.com/gamedev/articles/col0599.pdf

var DAMPING = 0.03;
var DRAG = 1 - DAMPING;
var MASS = 0.1;
var restDistance = 25;

var xSegs = 10;
var ySegs = 10;

var clothFunction = plane( restDistance * xSegs, restDistance * ySegs );

var cloth = new Cloth( xSegs, ySegs );

var GRAVITY = 981 * 1.4;
var gravity = new THREE.Vector3( 0, - GRAVITY, 0 ).multiplyScalar( MASS );


var TIMESTEP = 18 / 1000;
var TIMESTEP_SQ = TIMESTEP * TIMESTEP;

var pins = [];


var wind = true;
var windStrength = 2;
var windForce = new THREE.Vector3( 0, 0, 0 );

var ballPosition = new THREE.Vector3( 0, - 45, 0 );
var ballSize = 60; //40

var tmpForce = new THREE.Vector3();

var lastTime;


function plane( width, height ) {

	return function( u, v ) {

		var x = ( u - 0.5 ) * width;
		var y = ( v + 0.5 ) * height;
		var z = 0;

		return new THREE.Vector3( x, y, z );

	};

}

function Particle( x, y, z, mass ) {

	this.position = clothFunction( x, y ); // position
	this.previous = clothFunction( x, y ); // previous
	this.original = clothFunction( x, y );
	this.a = new THREE.Vector3( 0, 0, 0 ); // acceleration
	this.mass = mass;
	this.invMass = 1 / mass;
	this.tmp = new THREE.Vector3();
	this.tmp2 = new THREE.Vector3();

}

// Force -> Acceleration

Particle.prototype.addForce = function( force ) {

	this.a.add(
		this.tmp2.copy( force ).multiplyScalar( this.invMass )
	);

};


// Performs verlet integration

Particle.prototype.integrate = function( timesq ) {

	var newPos = this.tmp.subVectors( this.position, this.previous );
	newPos.multiplyScalar( DRAG ).add( this.position );
	newPos.add( this.a.multiplyScalar( timesq ) );

	this.tmp = this.previous;
	this.previous = this.position;
	this.position = newPos;

	this.a.set( 0, 0, 0 );

};


var diff = new THREE.Vector3();

function satisifyConstrains( p1, p2, distance ) {

	diff.subVectors( p2.position, p1.position );
	var currentDist = diff.length();
	if ( currentDist === 0 ) return; // prevents division by 0
	var correction = diff.multiplyScalar( 1 - distance / currentDist );
	var correctionHalf = correction.multiplyScalar( 0.5 );
	p1.position.add( correctionHalf );
	p2.position.sub( correctionHalf );

}


function Cloth( w, h ) {

	w = w || 10;
	h = h || 10;
	this.w = w;
	this.h = h;

	var particles = [];
	var constrains = [];

	var u, v;

	// Create particles
	for ( v = 0; v <= h; v ++ ) {

		for ( u = 0; u <= w; u ++ ) {

			particles.push(
				new Particle( u / w, v / h, 0, MASS )
			);

		}

	}

	// Structural

	for ( v = 0; v < h; v ++ ) {

		for ( u = 0; u < w; u ++ ) {

			constrains.push( [
				particles[ index( u, v ) ],
				particles[ index( u, v + 1 ) ],
				restDistance
			] );

			constrains.push( [
				particles[ index( u, v ) ],
				particles[ index( u + 1, v ) ],
				restDistance
			] );

		}

	}

	for ( u = w, v = 0; v < h; v ++ ) {

		constrains.push( [
			particles[ index( u, v ) ],
			particles[ index( u, v + 1 ) ],
			restDistance

		] );

	}

	for ( v = h, u = 0; u < w; u ++ ) {

		constrains.push( [
			particles[ index( u, v ) ],
			particles[ index( u + 1, v ) ],
			restDistance
		] );

	}


	// While many system uses shear and bend springs,
	// the relax constrains model seem to be just fine
	// using structural springs.
	// Shear
	// var diagonalDist = Math.sqrt(restDistance * restDistance * 2);


	// for (v=0;v<h;v++) {
	// 	for (u=0;u<w;u++) {

	// 		constrains.push([
	// 			particles[index(u, v)],
	// 			particles[index(u+1, v+1)],
	// 			diagonalDist
	// 		]);

	// 		constrains.push([
	// 			particles[index(u+1, v)],
	// 			particles[index(u, v+1)],
	// 			diagonalDist
	// 		]);

	// 	}
	// }


	this.particles = particles;
	this.constrains = constrains;

	function index( u, v ) {

		return u + v * ( w + 1 );

	}

	this.index = index;

}

function simulate( time ) {

	if ( ! lastTime ) {

		lastTime = time;
		return;

	}

	var i, il, particles, particle, pt, constrains, constrain;

	// Aerodynamics forces

	if ( wind ) {

		var face, faces = clothGeometry.faces, normal;

		particles = cloth.particles;

		for ( i = 0, il = faces.length; i < il; i ++ ) {

			face = faces[ i ];
			normal = face.normal;

			tmpForce.copy( normal ).normalize().multiplyScalar( normal.dot( windForce ) );
			particles[ face.a ].addForce( tmpForce );
			particles[ face.b ].addForce( tmpForce );
			particles[ face.c ].addForce( tmpForce );

		}

	}

	for ( particles = cloth.particles, i = 0, il = particles.length; i < il; i ++ ) {

		particle = particles[ i ];
		particle.addForce( gravity );

		particle.integrate( TIMESTEP_SQ );

	}

	// Start Constrains

	constrains = cloth.constrains;
	il = constrains.length;

	for ( i = 0; i < il; i ++ ) {

		constrain = constrains[ i ];
		satisifyConstrains( constrain[ 0 ], constrain[ 1 ], constrain[ 2 ] );

	}

	// Ball Constrains

	ballPosition.z = - Math.sin( Date.now() / 600 ) * 90 ; //+ 40;
	ballPosition.x = Math.cos( Date.now() / 400 ) * 70;

	if ( sphere.visible ) {

		for ( particles = cloth.particles, i = 0, il = particles.length; i < il; i ++ ) {

			particle = particles[ i ];
			pos = particle.position;
			diff.subVectors( pos, ballPosition );
			if ( diff.length() < ballSize ) {

				// collided
				diff.normalize().multiplyScalar( ballSize );
				pos.copy( ballPosition ).add( diff );

			}

		}

	}


	// Floor Constains

	for ( particles = cloth.particles, i = 0, il = particles.length; i < il; i ++ ) {

		particle = particles[ i ];
		pos = particle.position;
		if ( pos.y < - 250 ) {

			pos.y = - 250;

		}

	}

	// Pin Constrains

	for ( i = 0, il = pins.length; i < il; i ++ ) {

		var xy = pins[ i ];
		var p = particles[ xy ];
		p.position.copy( p.original );
		p.previous.copy( p.original );

	}


}

/*
 * A bunch of parametric curves
 * @author zz85
 *
 * Formulas collected from various sources
 *	http://mathworld.wolfram.com/HeartCurve.html
 *	http://mathdl.maa.org/images/upload_library/23/stemkoski/knots/page6.html
 *	http://en.wikipedia.org/wiki/Viviani%27s_curve
 *	http://mathdl.maa.org/images/upload_library/23/stemkoski/knots/page4.html
 *	http://www.mi.sanu.ac.rs/vismath/taylorapril2011/Taylor.pdf
 *	http://prideout.net/blog/?p=44
 */

// Lets define some curves
THREE.Curves = {};


 THREE.Curves.GrannyKnot = THREE.Curve.create( function() {},

	 function( t ) {

		t = 2 * Math.PI * t;

		var x = - 0.22 * Math.cos( t ) - 1.28 * Math.sin( t ) - 0.44 * Math.cos( 3 * t ) - 0.78 * Math.sin( 3 * t );
		var y = - 0.1 * Math.cos( 2 * t ) - 0.27 * Math.sin( 2 * t ) + 0.38 * Math.cos( 4 * t ) + 0.46 * Math.sin( 4 * t );
		var z = 0.7 * Math.cos( 3 * t ) - 0.4 * Math.sin( 3 * t );
		return new THREE.Vector3( x, y, z ).multiplyScalar( 20 );

	}
);

THREE.Curves.HeartCurve = THREE.Curve.create(

function( s ) {

	this.scale = ( s === undefined ) ? 5 : s;

},

function( t ) {

	t *= 2 * Math.PI;

	var tx = 16 * Math.pow( Math.sin( t ), 3 );
	var ty = 13 * Math.cos( t ) - 5 * Math.cos( 2 * t ) - 2 * Math.cos( 3 * t ) - Math.cos( 4 * t ), tz = 0;

	return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );

}

);



// Viviani's Curve
THREE.Curves.VivianiCurve = THREE.Curve.create(

	function( radius ) {

		this.radius = radius;

	},

	function( t ) {

		t = t * 4 * Math.PI; // Normalized to 0..1
		var a = this.radius / 2;
		var tx = a * ( 1 + Math.cos( t ) ),
			ty = a * Math.sin( t ),
			tz = 2 * a * Math.sin( t / 2 );

		return new THREE.Vector3( tx, ty, tz );

	}

);


THREE.Curves.KnotCurve = THREE.Curve.create(

	function() {

	},

	function( t ) {

		t *= 2 * Math.PI;

		var R = 10;
		var s = 50;
		var tx = s * Math.sin( t ),
			ty = Math.cos( t ) * ( R + s * Math.cos( t ) ),
			tz = Math.sin( t ) * ( R + s * Math.cos( t ) );

		return new THREE.Vector3( tx, ty, tz );

	}

);

THREE.Curves.HelixCurve = THREE.Curve.create(

	function() {

	},

	function( t ) {

		var a = 30; // radius
		var b = 150; //height
		var t2 = 2 * Math.PI * t * b / 30;
		var tx = Math.cos( t2 ) * a,
			ty = Math.sin( t2 ) * a,
			tz = b * t;

		return new THREE.Vector3( tx, ty, tz );

	}

);

THREE.Curves.TrefoilKnot = THREE.Curve.create(

	function( s ) {

		this.scale = ( s === undefined ) ? 10 : s;

	},

	function( t ) {

		t *= Math.PI * 2;
		var tx = ( 2 + Math.cos( 3 * t ) ) * Math.cos( 2 * t ),
			ty = ( 2 + Math.cos( 3 * t ) ) * Math.sin( 2 * t ),
			tz = Math.sin( 3 * t );

		return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );

	}

);

THREE.Curves.TorusKnot = THREE.Curve.create(

	function( s ) {

		this.scale = ( s === undefined ) ? 10 : s;

	},

	function( t ) {

		var p = 3,
			q = 4;
		t *= Math.PI * 2;
		var tx = ( 2 + Math.cos( q * t ) ) * Math.cos( p * t ),
			ty = ( 2 + Math.cos( q * t ) ) * Math.sin( p * t ),
			tz = Math.sin( q * t );

		return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );

	}

);


THREE.Curves.CinquefoilKnot = THREE.Curve.create(

	function( s ) {

		this.scale = ( s === undefined ) ? 10 : s;

	},

	function( t ) {

		var p = 2,
			q = 5;
		t *= Math.PI * 2;
		var tx = ( 2 + Math.cos( q * t ) ) * Math.cos( p * t ),
			ty = ( 2 + Math.cos( q * t ) ) * Math.sin( p * t ),
			tz = Math.sin( q * t );

		return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );

	}

);


THREE.Curves.TrefoilPolynomialKnot = THREE.Curve.create(

	function( s ) {

		this.scale = ( s === undefined ) ? 10 : s;

	},

	function( t ) {

		t = t * 4 - 2;
		var tx = Math.pow( t, 3 ) - 3 * t,
			ty = Math.pow( t, 4 ) - 4 * t * t,
			tz = 1 / 5 * Math.pow( t, 5 ) - 2 * t;

		return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );

	}

);

// var scaleTo = function(x, y) {
//   var r = y - x;
//   return function(t) {
//     t * r + x;
//   };
// }
var scaleTo = function( x, y, t ) {

	var r = y - x;
	return t * r + x;

};

THREE.Curves.FigureEightPolynomialKnot = THREE.Curve.create(

	function( s ) {

		this.scale = ( s === undefined ) ? 1 : s;

	},

	function( t ) {

		t = scaleTo( - 4, 4, t );
		var tx = 2 / 5 * t * ( t * t - 7 ) * ( t * t - 10 ),
			ty = Math.pow( t, 4 ) - 13 * t * t,
			tz = 1 / 10 * t * ( t * t - 4 ) * ( t * t - 9 ) * ( t * t - 12 );

		return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );

	}

);

THREE.Curves.DecoratedTorusKnot4a = THREE.Curve.create(

	function( s ) {

		this.scale = ( s === undefined ) ? 40 : s;

	},

	function( t ) {

		t *= Math.PI * 2;
		var
		x = Math.cos( 2 * t ) * ( 1 + 0.6 * ( Math.cos( 5 * t ) + 0.75 * Math.cos( 10 * t ) ) ),
			y = Math.sin( 2 * t ) * ( 1 + 0.6 * ( Math.cos( 5 * t ) + 0.75 * Math.cos( 10 * t ) ) ),
			z = 0.35 * Math.sin( 5 * t );

		return new THREE.Vector3( x, y, z ).multiplyScalar( this.scale );

	}

);


THREE.Curves.DecoratedTorusKnot4b = THREE.Curve.create(

	function( s ) {

		this.scale = ( s === undefined ) ? 40 : s;

	},

	function( t ) {

		var fi = t * Math.PI * 2;
		var x = Math.cos( 2 * fi ) * ( 1 + 0.45 * Math.cos( 3 * fi ) + 0.4 * Math.cos( 9 * fi ) ),
			y = Math.sin( 2 * fi ) * ( 1 + 0.45 * Math.cos( 3 * fi ) + 0.4 * Math.cos( 9 * fi ) ),
			z = 0.2 * Math.sin( 9 * fi );

		return new THREE.Vector3( x, y, z ).multiplyScalar( this.scale );

	}

);


THREE.Curves.DecoratedTorusKnot5a = THREE.Curve.create(

	function( s ) {

		this.scale = ( s === undefined ) ? 40 : s;

	},

	function( t ) {

		var fi = t * Math.PI * 2;
		var x = Math.cos( 3 * fi ) * ( 1 + 0.3 * Math.cos( 5 * fi ) + 0.5 * Math.cos( 10 * fi ) ),
			y = Math.sin( 3 * fi ) * ( 1 + 0.3 * Math.cos( 5 * fi ) + 0.5 * Math.cos( 10 * fi ) ),
			z = 0.2 * Math.sin( 20 * fi );

		return new THREE.Vector3( x, y, z ).multiplyScalar( this.scale );

	}

);

THREE.Curves.DecoratedTorusKnot5c = THREE.Curve.create(

	function( s ) {

		this.scale = ( s === undefined ) ? 40 : s;

	},

	function( t ) {

		var fi = t * Math.PI * 2;
		var x = Math.cos( 4 * fi ) * ( 1 + 0.5 * ( Math.cos( 5 * fi ) + 0.4 * Math.cos( 20 * fi ) ) ),
			y = Math.sin( 4 * fi ) * ( 1 + 0.5 * ( Math.cos( 5 * fi ) + 0.4 * Math.cos( 20 * fi ) ) ),
			z = 0.35 * Math.sin( 15 * fi );

		return new THREE.Vector3( x, y, z ).multiplyScalar( this.scale );

	}

);

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

var Detector = {

	canvas: !! window.CanvasRenderingContext2D,
	webgl: ( function () {

		try {

			var canvas = document.createElement( 'canvas' ); return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );

		} catch ( e ) {

			return false;

		}

	} )(),
	workers: !! window.Worker,
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage: function () {

		var element = document.createElement( 'div' );
		element.id = 'webgl-error-message';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '13px';
		element.style.fontWeight = 'normal';
		element.style.textAlign = 'center';
		element.style.background = '#fff';
		element.style.color = '#000';
		element.style.padding = '1.5em';
		element.style.width = '400px';
		element.style.margin = '5em auto 0';

		if ( ! this.webgl ) {

			element.innerHTML = window.WebGLRenderingContext ? [
				'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' ) : [
				'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' );

		}

		return element;

	},

	addGetWebGLMessage: function ( parameters ) {

		var parent, id, element;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		element = Detector.getWebGLErrorMessage();
		element.id = id;

		parent.appendChild( element );

	}

};

// browserify support
if ( typeof module === 'object' ) {

	module.exports = Detector;

}

/**
 * @author Ben Houston / http://clara.io / bhouston
 * @author Prashant Sharma / spidersharma03
 */

THREE.Encodings = function() {
  if( THREE.toHalf === undefined ) throw new Error("THREE.Encodings is required for HDRCubeMapLoader when loading half data.");
}

THREE.Encodings.RGBEByteToRGBFloat = function( sourceArray, sourceOffset, destArray, destOffset ) {
  var e = sourceArray[sourceOffset+3];
  var scale = Math.pow(2.0, e - 128.0) / 255.0;

  destArray[destOffset+0] = sourceArray[sourceOffset+0] * scale;
  destArray[destOffset+1] = sourceArray[sourceOffset+1] * scale;
  destArray[destOffset+2] = sourceArray[sourceOffset+2] * scale;
}

THREE.Encodings.RGBEByteToRGBHalf = function( sourceArray, sourceOffset, destArray, destOffset ) {
  var e = sourceArray[sourceOffset+3];
  var scale = Math.pow(2.0, e - 128.0) / 255.0;

  destArray[destOffset+0] = THREE.toHalf( sourceArray[sourceOffset+0] * scale );
  destArray[destOffset+1] = THREE.toHalf( sourceArray[sourceOffset+1] * scale );
  destArray[destOffset+2] = THREE.toHalf( sourceArray[sourceOffset+2] * scale );
}

/**
 * @author yomboprime https://github.com/yomboprime
 *
 * GPUComputationRenderer, based on SimulationRenderer by zz85
 *
 * The GPUComputationRenderer uses the concept of variables. These variables are RGBA float textures that hold 4 floats
 * for each compute element (texel)
 *
 * Each variable has a fragment shader that defines the computation made to obtain the variable in question.
 * You can use as many variables you need, and make dependencies so you can use textures of other variables in the shader
 * (the sampler uniforms are added automatically) Most of the variables will need themselves as dependency.
 *
 * The renderer has actually two render targets per variable, to make ping-pong. Textures from the current frame are used
 * as inputs to render the textures of the next frame.
 *
 * The render targets of the variables can be used as input textures for your visualization shaders.
 *
 * Variable names should be valid identifiers and should not collide with THREE GLSL used identifiers.
 * a common approach could be to use 'texture' prefixing the variable name; i.e texturePosition, textureVelocity...
 *
 * The size of the computation (sizeX * sizeY) is defined as 'resolution' automatically in the shader. For example:
 * #DEFINE resolution vec2( 1024.0, 1024.0 )
 *
 * -------------
 *
 * Basic use:
 *
 * // Initialization...
 *
 * // Create computation renderer
 * var gpuCompute = new GPUComputationRenderer( 1024, 1024, renderer );
 *
 * // Create initial state float textures
 * var pos0 = gpuCompute.createTexture();
 * var vel0 = gpuCompute.createTexture();
 * // and fill in here the texture data...
 *
 * // Add texture variables
 * var velVar = gpuCompute.addVariable( "textureVelocity", fragmentShaderVel, pos0 );
 * var posVar = gpuCompute.addVariable( "texturePosition", fragmentShaderPos, vel0 );
 *
 * // Add variable dependencies
 * gpuCompute.setVariableDependencies( velVar, [ velVar, posVar ] );
 * gpuCompute.setVariableDependencies( posVar, [ velVar, posVar ] );
 *
 * // Add custom uniforms
 * velVar.material.uniforms.time = { value: 0.0 };
 *
 * // Check for completeness
 * var error = gpuCompute.init();
 * if ( error !== null ) {
 *		console.error( error );
  * }
 *
 *
 * // In each frame...
 *
 * // Compute!
 * gpuCompute.compute();
 *
 * // Update texture uniforms in your visualization materials with the gpu renderer output
 * myMaterial.uniforms.myTexture.value = gpuCompute.getCurrentRenderTarget( posVar ).texture;
 *
 * // Do your rendering
 * renderer.render( myScene, myCamera );
 *
 * -------------
 *
 * Also, you can use utility functions to create ShaderMaterial and perform computations (rendering between textures)
 * Note that the shaders can have multiple input textures.
 *
 * var myFilter1 = gpuCompute.createShaderMaterial( myFilterFragmentShader1, { theTexture: { value: null } } );
 * var myFilter2 = gpuCompute.createShaderMaterial( myFilterFragmentShader2, { theTexture: { value: null } } );
 *
 * var inputTexture = gpuCompute.createTexture();
 *
 * // Fill in here inputTexture...
 *
 * myFilter1.uniforms.theTexture.value = inputTexture;
 *
 * var myRenderTarget = gpuCompute.createRenderTarget();
 * myFilter2.uniforms.theTexture.value = myRenderTarget.texture;
 *
 * var outputRenderTarget = gpuCompute.createRenderTarget();
 *
 * // Now use the output texture where you want:
 * myMaterial.uniforms.map.value = outputRenderTarget.texture;
 *
 * // And compute each frame, before rendering to screen:
 * gpuCompute.doRenderTarget( myFilter1, myRenderTarget );
 * gpuCompute.doRenderTarget( myFilter2, outputRenderTarget );
 * 
 *
 *
 * @param {int} sizeX Computation problem size is always 2d: sizeX * sizeY elements.
 * @param {int} sizeY Computation problem size is always 2d: sizeX * sizeY elements.
 * @param {WebGLRenderer} renderer The renderer
  */

function GPUComputationRenderer( sizeX, sizeY, renderer ) {

	this.variables = [];

	this.currentTextureIndex = 0;

	var scene = new THREE.Scene();

	var camera = new THREE.Camera();
	camera.position.z = 1;

	var passThruUniforms = {
		texture: { value: null }
	};

	var passThruShader = createShaderMaterial( getPassThroughFragmentShader(), passThruUniforms );

	var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), passThruShader );
	scene.add( mesh );


	this.addVariable = function( variableName, computeFragmentShader, initialValueTexture ) {

		var material = this.createShaderMaterial( computeFragmentShader );

		var variable = {
			name: variableName,
			initialValueTexture: initialValueTexture,
			material: material,
			dependencies: null,
			renderTargets: [],
			wrapS: null,
			wrapT: null,
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter
		};

		this.variables.push( variable );

		return variable;
		
	};

	this.setVariableDependencies = function( variable, dependencies ) {

		variable.dependencies = dependencies;

	};

	this.init = function() {

		if ( ! renderer.extensions.get( "OES_texture_float" ) ) {

			return "No OES_texture_float support for float textures.";

		}

		if ( renderer.capabilities.maxVertexTextures === 0 ) {

			return "No support for vertex shader textures.";

		}

		for ( var i = 0; i < this.variables.length; i++ ) {

			var variable = this.variables[ i ];

			// Creates rendertargets and initialize them with input texture
			variable.renderTargets[ 0 ] = this.createRenderTarget( sizeX, sizeY, variable.wrapS, variable.wrapT, variable.minFilter, variable.magFilter );
			variable.renderTargets[ 1 ] = this.createRenderTarget( sizeX, sizeY, variable.wrapS, variable.wrapT, variable.minFilter, variable.magFilter );
			this.renderTexture( variable.initialValueTexture, variable.renderTargets[ 0 ] );
			this.renderTexture( variable.initialValueTexture, variable.renderTargets[ 1 ] );

			// Adds dependencies uniforms to the ShaderMaterial
			var material = variable.material;
			var uniforms = material.uniforms;
			if ( variable.dependencies !== null ) {

				for ( var d = 0; d < variable.dependencies.length; d++ ) {

					var depVar = variable.dependencies[ d ];

					if ( depVar.name !== variable.name ) {

						// Checks if variable exists
						var found = false;
						for ( var j = 0; j < this.variables.length; j++ ) {

							if ( depVar.name === this.variables[ j ].name ) {
								found = true;
								break;
							}

						}
						if ( ! found ) {
							return "Variable dependency not found. Variable=" + variable.name + ", dependency=" + depVar.name;
						}

					}

					uniforms[ depVar.name ] = { value: null };

					material.fragmentShader = "\nuniform sampler2D " + depVar.name + ";\n" + material.fragmentShader;

				}
			}
		}

		this.currentTextureIndex = 0;

		return null;

	};

	this.compute = function() {

		var currentTextureIndex = this.currentTextureIndex;
		var nextTextureIndex = this.currentTextureIndex === 0 ? 1 : 0;

		for ( var i = 0, il = this.variables.length; i < il; i++ ) {

			var variable = this.variables[ i ];

			// Sets texture dependencies uniforms
			if ( variable.dependencies !== null ) {

				var uniforms = variable.material.uniforms;
				for ( var d = 0, dl = variable.dependencies.length; d < dl; d++ ) {

					var depVar = variable.dependencies[ d ];

					uniforms[ depVar.name ].value = depVar.renderTargets[ currentTextureIndex ].texture;

				}

			}

			// Performs the computation for this variable
			this.doRenderTarget( variable.material, variable.renderTargets[ nextTextureIndex ] );

		}

		this.currentTextureIndex = nextTextureIndex;
	};

	this.getCurrentRenderTarget = function( variable ) {

		return variable.renderTargets[ this.currentTextureIndex ];

	};

	this.getAlternateRenderTarget = function( variable ) {

		return variable.renderTargets[ this.currentTextureIndex === 0 ? 1 : 0 ];

	};

	function addResolutionDefine( materialShader ) {

		materialShader.defines.resolution = 'vec2( ' + sizeX.toFixed( 1 ) + ', ' + sizeY.toFixed( 1 ) + " )";

	};
	this.addResolutionDefine = addResolutionDefine;


	// The following functions can be used to compute things manually

	function createShaderMaterial( computeFragmentShader, uniforms ) {

		uniforms = uniforms || {};

		var material = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: getPassThroughVertexShader(),
			fragmentShader: computeFragmentShader
		} );

		addResolutionDefine( material );

		return material;
	};
	this.createShaderMaterial = createShaderMaterial;

	this.createRenderTarget = function( sizeXTexture, sizeYTexture, wrapS, wrapT, minFilter, magFilter ) {

		sizeXTexture = sizeXTexture || sizeX;
		sizeYTexture = sizeYTexture || sizeY;

		wrapS = wrapS || THREE.ClampToEdgeWrapping;
		wrapT = wrapT || THREE.ClampToEdgeWrapping;

		minFilter = minFilter || THREE.NearestFilter;
		magFilter = magFilter || THREE.NearestFilter;

		var renderTarget = new THREE.WebGLRenderTarget( sizeXTexture, sizeYTexture, {
			wrapS: wrapS,
			wrapT: wrapT,
			minFilter: minFilter,
			magFilter: magFilter,
			format: THREE.RGBAFormat,
			type: THREE.FloatType,
			stencilBuffer: false
		} );

		return renderTarget;

	};

    this.createTexture = function( sizeXTexture, sizeYTexture ) {

		sizeXTexture = sizeXTexture || sizeX;
		sizeYTexture = sizeYTexture || sizeY;

		var a = new Float32Array( sizeXTexture * sizeYTexture * 4 );
		var texture = new THREE.DataTexture( a, sizeX, sizeY, THREE.RGBAFormat, THREE.FloatType );
		texture.needsUpdate = true;

		return texture;

	};


	this.renderTexture = function( input, output ) {

		// Takes a texture, and render out in rendertarget
		// input = Texture
		// output = RenderTarget

		passThruUniforms.texture.value = input;

		this.doRenderTarget( passThruShader, output);

		passThruUniforms.texture.value = null;

	};

	this.doRenderTarget = function( material, output ) {

		mesh.material = material;
		renderer.render( scene, camera, output );
		mesh.material = passThruShader;

	};

	// Shaders

	function getPassThroughVertexShader() {

		return	"void main()	{\n" +
				"\n" +
				"	gl_Position = vec4( position, 1.0 );\n" +
				"\n" +
				"}\n";

	}

	function getPassThroughFragmentShader() {

		return	"uniform sampler2D texture;\n" +
				"\n" +
				"void main() {\n" +
				"\n" +
				"	vec2 uv = gl_FragCoord.xy / resolution.xy;\n" +
				"\n" +
				"	gl_FragColor = texture2D( texture, uv );\n" +
				"\n" +
				"}\n";

	}

}
/*
 * GPU Particle System
 * @author flimshaw - Charlie Hoey - http://charliehoey.com
 *
 * A simple to use, general purpose GPU system. Particles are spawn-and-forget with
 * several options available, and do not require monitoring or cleanup after spawning.
 * Because the paths of all particles are completely deterministic once spawned, the scale
 * and direction of time is also variable.
 *
 * Currently uses a static wrapping perlin noise texture for turbulence, and a small png texture for
 * particles, but adding support for a particle texture atlas or changing to a different type of turbulence
 * would be a fairly light day's work.
 *
 * Shader and javascript packing code derrived from several Stack Overflow examples.
 *
 */

THREE.GPUParticleSystem = function(options) {

	var self = this;
	var options = options || {};

	// parse options and use defaults
	self.PARTICLE_COUNT = options.maxParticles || 1000000;
	self.PARTICLE_CONTAINERS = options.containerCount || 1;
	
	self.PARTICLE_NOISE_TEXTURE = options.particleNoiseTex || null;
	self.PARTICLE_SPRITE_TEXTURE = options.particleSpriteTex || null;
	
	self.PARTICLES_PER_CONTAINER = Math.ceil(self.PARTICLE_COUNT / self.PARTICLE_CONTAINERS);
	self.PARTICLE_CURSOR = 0;
	self.time = 0;


	// Custom vertex and fragement shader
	var GPUParticleShader = {

		vertexShader: [

			'precision highp float;',
			'const vec4 bitSh = vec4(256. * 256. * 256., 256. * 256., 256., 1.);',
			'const vec4 bitMsk = vec4(0.,vec3(1./256.0));',
			'const vec4 bitShifts = vec4(1.) / bitSh;',

			'#define FLOAT_MAX	1.70141184e38',
			'#define FLOAT_MIN	1.17549435e-38',

			'lowp vec4 encode_float(highp float v) {',
			'highp float av = abs(v);',

			'//Handle special cases',
			'if(av < FLOAT_MIN) {',
			'return vec4(0.0, 0.0, 0.0, 0.0);',
			'} else if(v > FLOAT_MAX) {',
			'return vec4(127.0, 128.0, 0.0, 0.0) / 255.0;',
			'} else if(v < -FLOAT_MAX) {',
			'return vec4(255.0, 128.0, 0.0, 0.0) / 255.0;',
			'}',

			'highp vec4 c = vec4(0,0,0,0);',

			'//Compute exponent and mantissa',
			'highp float e = floor(log2(av));',
			'highp float m = av * pow(2.0, -e) - 1.0;',

			//Unpack mantissa
			'c[1] = floor(128.0 * m);',
			'm -= c[1] / 128.0;',
			'c[2] = floor(32768.0 * m);',
			'm -= c[2] / 32768.0;',
			'c[3] = floor(8388608.0 * m);',

			'//Unpack exponent',
			'highp float ebias = e + 127.0;',
			'c[0] = floor(ebias / 2.0);',
			'ebias -= c[0] * 2.0;',
			'c[1] += floor(ebias) * 128.0;',

			'//Unpack sign bit',
			'c[0] += 128.0 * step(0.0, -v);',

			'//Scale back to range',
			'return c / 255.0;',
			'}',

			'vec4 pack(const in float depth)',
			'{',
			'const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);',
			'const vec4 bit_mask	= vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);',
			'vec4 res = mod(depth*bit_shift*vec4(255), vec4(256))/vec4(255);',
			'res -= res.xxyz * bit_mask;',
			'return res;',
			'}',

			'float unpack(const in vec4 rgba_depth)',
			'{',
			'const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);',
			'float depth = dot(rgba_depth, bit_shift);',
			'return depth;',
			'}',

			'uniform float uTime;',
			'uniform float uScale;',
			'uniform sampler2D tNoise;',

			'attribute vec4 particlePositionsStartTime;',
			'attribute vec4 particleVelColSizeLife;',

			'varying vec4 vColor;',
			'varying float lifeLeft;',

			'void main() {',

			'// unpack things from our attributes',
			'vColor = encode_float( particleVelColSizeLife.y );',

			'// convert our velocity back into a value we can use',
			'vec4 velTurb = encode_float( particleVelColSizeLife.x );',
			'vec3 velocity = vec3( velTurb.xyz );',
			'float turbulence = velTurb.w;',

			'vec3 newPosition;',

			'float timeElapsed = uTime - particlePositionsStartTime.a;',

			'lifeLeft = 1. - (timeElapsed / particleVelColSizeLife.w);',

			'gl_PointSize = ( uScale * particleVelColSizeLife.z ) * lifeLeft;',

			'velocity.x = ( velocity.x - .5 ) * 3.;',
			'velocity.y = ( velocity.y - .5 ) * 3.;',
			'velocity.z = ( velocity.z - .5 ) * 3.;',

			'newPosition = particlePositionsStartTime.xyz + ( velocity * 10. ) * ( uTime - particlePositionsStartTime.a );',

			'vec3 noise = texture2D( tNoise, vec2( newPosition.x * .015 + (uTime * .05), newPosition.y * .02 + (uTime * .015) )).rgb;',
			'vec3 noiseVel = ( noise.rgb - .5 ) * 30.;',

			'newPosition = mix(newPosition, newPosition + vec3(noiseVel * ( turbulence * 5. ) ), (timeElapsed / particleVelColSizeLife.a) );',

			'if( velocity.y > 0. && velocity.y < .05 ) {',
			'lifeLeft = 0.;',
			'}',

			'if( velocity.x < -1.45 ) {',
			'lifeLeft = 0.;',
			'}',

			'if( timeElapsed > 0. ) {',
			'gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );',
			'} else {',
			'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
			'lifeLeft = 0.;',
			'gl_PointSize = 0.;',
			'}',
			'}'

		].join("\n"),

		fragmentShader: [

			'float scaleLinear(float value, vec2 valueDomain) {',
			'return (value - valueDomain.x) / (valueDomain.y - valueDomain.x);',
			'}',

			'float scaleLinear(float value, vec2 valueDomain, vec2 valueRange) {',
			'return mix(valueRange.x, valueRange.y, scaleLinear(value, valueDomain));',
			'}',

			'varying vec4 vColor;',
			'varying float lifeLeft;',

			'uniform sampler2D tSprite;',

			'void main() {',

			'float alpha = 0.;',

			'if( lifeLeft > .995 ) {',
			'alpha = scaleLinear( lifeLeft, vec2(1., .995), vec2(0., 1.));//mix( 0., 1., ( lifeLeft - .95 ) * 100. ) * .75;',
			'} else {',
			'alpha = lifeLeft * .75;',
			'}',

			'vec4 tex = texture2D( tSprite, gl_PointCoord );',

			'gl_FragColor = vec4( vColor.rgb * tex.a, alpha * tex.a );',
			'}'

		].join("\n")

	};

	// preload a million random numbers
	self.rand = [];

	for (var i = 1e5; i > 0; i--) {
		self.rand.push(Math.random() - .5);
	}

	self.random = function() {
		return ++i >= self.rand.length ? self.rand[i = 1] : self.rand[i];
	}

	var textureLoader = new THREE.TextureLoader();

	self.particleNoiseTex = self.PARTICLE_NOISE_TEXTURE || textureLoader.load("textures/perlin-512.png");
	self.particleNoiseTex.wrapS = self.particleNoiseTex.wrapT = THREE.RepeatWrapping;

	self.particleSpriteTex = self.PARTICLE_SPRITE_TEXTURE || textureLoader.load("textures/particle2.png");
	self.particleSpriteTex.wrapS = self.particleSpriteTex.wrapT = THREE.RepeatWrapping;

	self.particleShaderMat = new THREE.ShaderMaterial({
		transparent: true,
		depthWrite: false,
		uniforms: {
			"uTime": {
				value: 0.0
			},
			"uScale": {
				value: 1.0
			},
			"tNoise": {
				value: self.particleNoiseTex
			},
			"tSprite": {
				value: self.particleSpriteTex
			}
		},
		blending: THREE.AdditiveBlending,
		vertexShader: GPUParticleShader.vertexShader,
		fragmentShader: GPUParticleShader.fragmentShader
	});

	// define defaults for all values
	self.particleShaderMat.defaultAttributeValues.particlePositionsStartTime = [0, 0, 0, 0];
	self.particleShaderMat.defaultAttributeValues.particleVelColSizeLife = [0, 0, 0, 0];

	self.particleContainers = [];


	// extend Object3D
	THREE.Object3D.apply(this, arguments);

	this.init = function() {

		for (var i = 0; i < self.PARTICLE_CONTAINERS; i++) {

			var c = new THREE.GPUParticleContainer(self.PARTICLES_PER_CONTAINER, self);
			self.particleContainers.push(c);
			self.add(c);

		}

	}

	this.spawnParticle = function(options) {

		self.PARTICLE_CURSOR++;
		if (self.PARTICLE_CURSOR >= self.PARTICLE_COUNT) {
			self.PARTICLE_CURSOR = 1;
		}

		var currentContainer = self.particleContainers[Math.floor(self.PARTICLE_CURSOR / self.PARTICLES_PER_CONTAINER)];

		currentContainer.spawnParticle(options);

	}

	this.update = function(time) {
		for (var i = 0; i < self.PARTICLE_CONTAINERS; i++) {

			self.particleContainers[i].update(time);

		}
	};

	this.init();

}

THREE.GPUParticleSystem.prototype = Object.create(THREE.Object3D.prototype);
THREE.GPUParticleSystem.prototype.constructor = THREE.GPUParticleSystem;


// Subclass for particle containers, allows for very large arrays to be spread out
THREE.GPUParticleContainer = function(maxParticles, particleSystem) {

	var self = this;
	self.PARTICLE_COUNT = maxParticles || 100000;
	self.PARTICLE_CURSOR = 0;
	self.time = 0;
	self.DPR = window.devicePixelRatio;
	self.GPUParticleSystem = particleSystem;

	var particlesPerArray = Math.floor(self.PARTICLE_COUNT / self.MAX_ATTRIBUTES);

	// extend Object3D
	THREE.Object3D.apply(this, arguments);

	// construct a couple small arrays used for packing variables into floats etc
	var UINT8_VIEW = new Uint8Array(4)
	var FLOAT_VIEW = new Float32Array(UINT8_VIEW.buffer)

	function decodeFloat(x, y, z, w) {
		UINT8_VIEW[0] = Math.floor(w)
		UINT8_VIEW[1] = Math.floor(z)
		UINT8_VIEW[2] = Math.floor(y)
		UINT8_VIEW[3] = Math.floor(x)
		return FLOAT_VIEW[0]
	}

	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(r, g, b) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}

	function hexToRgb(hex) {
		var r = hex >> 16;
		var g = (hex & 0x00FF00) >> 8;
		var b = hex & 0x0000FF;

		if (r > 0) r--;
		if (g > 0) g--;
		if (b > 0) b--;

		return [r, g, b];
	};

	self.particles = [];
	self.deadParticles = [];
	self.particlesAvailableSlot = [];

	// create a container for particles
	self.particleUpdate = false;

	// Shader Based Particle System
	self.particleShaderGeo = new THREE.BufferGeometry();

	// new hyper compressed attributes
	self.particleVertices = new Float32Array(self.PARTICLE_COUNT * 3); // position
	self.particlePositionsStartTime = new Float32Array(self.PARTICLE_COUNT * 4); // position
	self.particleVelColSizeLife = new Float32Array(self.PARTICLE_COUNT * 4);

	for (var i = 0; i < self.PARTICLE_COUNT; i++) {
		self.particlePositionsStartTime[i * 4 + 0] = 100; //x
		self.particlePositionsStartTime[i * 4 + 1] = 0; //y
		self.particlePositionsStartTime[i * 4 + 2] = 0.0; //z
		self.particlePositionsStartTime[i * 4 + 3] = 0.0; //startTime

		self.particleVertices[i * 3 + 0] = 0; //x
		self.particleVertices[i * 3 + 1] = 0; //y
		self.particleVertices[i * 3 + 2] = 0.0; //z

		self.particleVelColSizeLife[i * 4 + 0] = decodeFloat(128, 128, 0, 0); //vel
		self.particleVelColSizeLife[i * 4 + 1] = decodeFloat(0, 254, 0, 254); //color
		self.particleVelColSizeLife[i * 4 + 2] = 1.0; //size
		self.particleVelColSizeLife[i * 4 + 3] = 0.0; //lifespan
	}

	self.particleShaderGeo.addAttribute('position', new THREE.BufferAttribute(self.particleVertices, 3));
	self.particleShaderGeo.addAttribute('particlePositionsStartTime', new THREE.BufferAttribute(self.particlePositionsStartTime, 4).setDynamic(true));
	self.particleShaderGeo.addAttribute('particleVelColSizeLife', new THREE.BufferAttribute(self.particleVelColSizeLife, 4).setDynamic(true));

	self.posStart = self.particleShaderGeo.getAttribute('particlePositionsStartTime')
	self.velCol = self.particleShaderGeo.getAttribute('particleVelColSizeLife');

	self.particleShaderMat = self.GPUParticleSystem.particleShaderMat;

	this.init = function() {
		self.particleSystem = new THREE.Points(self.particleShaderGeo, self.particleShaderMat);
		self.particleSystem.frustumCulled = false;
		this.add(self.particleSystem);
	};

	var options = {},
		position = new THREE.Vector3(),
		velocity = new THREE.Vector3(),
		positionRandomness = 0.,
		velocityRandomness = 0.,
		color = 0xffffff,
		colorRandomness = 0.,
		turbulence = 0.,
		lifetime = 0.,
		size = 0.,
		sizeRandomness = 0.,
		i;

	var maxVel = 2;
	var maxSource = 250;
	this.offset = 0;
	this.count = 0;

	this.spawnParticle = function(options) {

		options = options || {};

		// setup reasonable default values for all arguments
		position = options.position !== undefined ? position.copy(options.position) : position.set(0., 0., 0.);
		velocity = options.velocity !== undefined ? velocity.copy(options.velocity) : velocity.set(0., 0., 0.);
		positionRandomness = options.positionRandomness !== undefined ? options.positionRandomness : 0.0;
		velocityRandomness = options.velocityRandomness !== undefined ? options.velocityRandomness : 0.0;
		color = options.color !== undefined ? options.color : 0xffffff;
		colorRandomness = options.colorRandomness !== undefined ? options.colorRandomness : 1.0;
		turbulence = options.turbulence !== undefined ? options.turbulence : 1.0;
		lifetime = options.lifetime !== undefined ? options.lifetime : 5.0;
		size = options.size !== undefined ? options.size : 10;
		sizeRandomness = options.sizeRandomness !== undefined ? options.sizeRandomness : 0.0,
			smoothPosition = options.smoothPosition !== undefined ? options.smoothPosition : false;

		if (self.DPR !== undefined) size *= self.DPR;

		i = self.PARTICLE_CURSOR;

		self.posStart.array[i * 4 + 0] = position.x + ((particleSystem.random()) * positionRandomness); // - ( velocity.x * particleSystem.random() ); //x
		self.posStart.array[i * 4 + 1] = position.y + ((particleSystem.random()) * positionRandomness); // - ( velocity.y * particleSystem.random() ); //y
		self.posStart.array[i * 4 + 2] = position.z + ((particleSystem.random()) * positionRandomness); // - ( velocity.z * particleSystem.random() ); //z
		self.posStart.array[i * 4 + 3] = self.time + (particleSystem.random() * 2e-2); //startTime

		if (smoothPosition === true) {
			self.posStart.array[i * 4 + 0] += -(velocity.x * particleSystem.random()); //x
			self.posStart.array[i * 4 + 1] += -(velocity.y * particleSystem.random()); //y
			self.posStart.array[i * 4 + 2] += -(velocity.z * particleSystem.random()); //z
		}

		var velX = velocity.x + (particleSystem.random()) * velocityRandomness;
		var velY = velocity.y + (particleSystem.random()) * velocityRandomness;
		var velZ = velocity.z + (particleSystem.random()) * velocityRandomness;

		// convert turbulence rating to something we can pack into a vec4
		var turbulence = Math.floor(turbulence * 254);

		// clamp our value to between 0. and 1.
		velX = Math.floor(maxSource * ((velX - -maxVel) / (maxVel - -maxVel)));
		velY = Math.floor(maxSource * ((velY - -maxVel) / (maxVel - -maxVel)));
		velZ = Math.floor(maxSource * ((velZ - -maxVel) / (maxVel - -maxVel)));

		self.velCol.array[i * 4 + 0] = decodeFloat(velX, velY, velZ, turbulence); //vel

		var rgb = hexToRgb(color);

		for (var c = 0; c < rgb.length; c++) {
			rgb[c] = Math.floor(rgb[c] + ((particleSystem.random()) * colorRandomness) * 254);
			if (rgb[c] > 254) rgb[c] = 254;
			if (rgb[c] < 0) rgb[c] = 0;
		}

		self.velCol.array[i * 4 + 1] = decodeFloat(rgb[0], rgb[1], rgb[2], 254); //color
		self.velCol.array[i * 4 + 2] = size + (particleSystem.random()) * sizeRandomness; //size
		self.velCol.array[i * 4 + 3] = lifetime; //lifespan

		if (this.offset == 0) {
			this.offset = self.PARTICLE_CURSOR;
		}

		self.count++;

		self.PARTICLE_CURSOR++;

		if (self.PARTICLE_CURSOR >= self.PARTICLE_COUNT) {
			self.PARTICLE_CURSOR = 0;
		}

		self.particleUpdate = true;

	}

	this.update = function(time) {

		self.time = time;
		self.particleShaderMat.uniforms['uTime'].value = time;

		this.geometryUpdate();

	};

	this.geometryUpdate = function() {
		if (self.particleUpdate == true) {
			self.particleUpdate = false;

			// if we can get away with a partial buffer update, do so
			if (self.offset + self.count < self.PARTICLE_COUNT) {
				self.posStart.updateRange.offset = self.velCol.updateRange.offset = self.offset * 4;
				self.posStart.updateRange.count = self.velCol.updateRange.count = self.count * 4;
			} else {
				self.posStart.updateRange.offset = 0;
				self.posStart.updateRange.count = self.velCol.updateRange.count = (self.PARTICLE_COUNT * 4);
			}

			self.posStart.needsUpdate = true;
			self.velCol.needsUpdate = true;

			self.offset = 0;
			self.count = 0;
		}
	}

	this.init();

}

THREE.GPUParticleContainer.prototype = Object.create(THREE.Object3D.prototype);
THREE.GPUParticleContainer.prototype.constructor = THREE.GPUParticleContainer;

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Gyroscope = function () {

	THREE.Object3D.call( this );

};

THREE.Gyroscope.prototype = Object.create( THREE.Object3D.prototype );
THREE.Gyroscope.prototype.constructor = THREE.Gyroscope;

THREE.Gyroscope.prototype.updateMatrixWorld = ( function () {

	var translationObject = new THREE.Vector3();
	var quaternionObject = new THREE.Quaternion();
	var scaleObject = new THREE.Vector3();

	var translationWorld = new THREE.Vector3();
	var quaternionWorld = new THREE.Quaternion();
	var scaleWorld = new THREE.Vector3();

	return function updateMatrixWorld( force ) {

		this.matrixAutoUpdate && this.updateMatrix();

		// update matrixWorld

		if ( this.matrixWorldNeedsUpdate || force ) {

			if ( this.parent !== null ) {

				this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

				this.matrixWorld.decompose( translationWorld, quaternionWorld, scaleWorld );
				this.matrix.decompose( translationObject, quaternionObject, scaleObject );

				this.matrixWorld.compose( translationWorld, quaternionObject, scaleWorld );


			} else {

				this.matrixWorld.copy( this.matrix );

			}


			this.matrixWorldNeedsUpdate = false;

			force = true;

		}

		// update children

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].updateMatrixWorld( force );

		}

	};

}() );

/**
 * Source: http://gamedev.stackexchange.com/questions/17326/conversion-of-a-number-from-single-precision-floating-point-representation-to-a/17410#17410
 */

THREE.toHalf = (function() {
  var floatView = new Float32Array(1);
  var int32View = new Int32Array(floatView.buffer);

  /* This method is faster than the OpenEXR implementation (very often
   * used, eg. in Ogre), with the additional benefit of rounding, inspired
   * by James Tursa?s half-precision code. */
  return function toHalf(val) {

    floatView[0] = val;
    var x = int32View[0];

    var bits = (x >> 16) & 0x8000; /* Get the sign */
    var m = (x >> 12) & 0x07ff; /* Keep one extra bit for rounding */
    var e = (x >> 23) & 0xff; /* Using int is faster here */

    /* If zero, or denormal, or exponent underflows too much for a denormal
     * half, return signed zero. */
    if (e < 103) {
      return bits;
    }

    /* If NaN, return NaN. If Inf or exponent overflow, return Inf. */
    if (e > 142) {
      bits |= 0x7c00;
      /* If exponent was 0xff and one mantissa bit was set, it means NaN,
           * not Inf, so make sure we set one mantissa bit too. */
      bits |= ((e == 255) ? 0 : 1) && (x & 0x007fffff);
      return bits;
    }

    /* If exponent underflows but not too much, return a denormal */
    if (e < 113) {
      m |= 0x0800;
      /* Extra rounding may overflow and set mantissa to 0 and exponent
       * to 1, which is OK. */
      bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1);
      return bits;
    }

    bits |= ((e - 112) << 10) | (m >> 1);
    /* Extra rounding. An overflow will set mantissa to 0 and increment
     * the exponent, which is OK. */
    bits += m & 1;
    return bits;
  };
}());

// http://mrl.nyu.edu/~perlin/noise/

var ImprovedNoise = function () {

	var p = [ 151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,
		 23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,
		 174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
		 133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
		 89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,
		 202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,
		 248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
		 178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
		 14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,
		 93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180 ];

	for (var i = 0; i < 256 ; i ++) {

		p[256 + i] = p[i];

	}

	function fade(t) {

		return t * t * t * (t * (t * 6 - 15) + 10);

	}

	function lerp(t, a, b) {

		return a + t * (b - a);

	}

	function grad(hash, x, y, z) {

		var h = hash & 15;
		var u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
		return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);

	}

	return {

		noise: function (x, y, z) {

			var floorX = Math.floor(x), floorY = Math.floor(y), floorZ = Math.floor(z);

			var X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;

			x -= floorX;
			y -= floorY;
			z -= floorZ;

			var xMinus1 = x - 1, yMinus1 = y - 1, zMinus1 = z - 1;

			var u = fade(x), v = fade(y), w = fade(z);

			var A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z, B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;

			return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z),
							grad(p[BA], xMinus1, y, z)),
						lerp(u, grad(p[AB], x, yMinus1, z),
							grad(p[BB], xMinus1, yMinus1, z))),
					lerp(v, lerp(u, grad(p[AA + 1], x, y, zMinus1),
							grad(p[BA + 1], xMinus1, y, z - 1)),
						lerp(u, grad(p[AB + 1], x, yMinus1, zMinus1),
							grad(p[BB + 1], xMinus1, yMinus1, zMinus1))));

		}
	}
};

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.MD2Character = function () {

	var scope = this;

	this.scale = 1;
	this.animationFPS = 6;

	this.root = new THREE.Object3D();

	this.meshBody = null;
	this.meshWeapon = null;

	this.skinsBody = [];
	this.skinsWeapon = [];

	this.weapons = [];

	this.activeAnimation = null;

	this.mixer = null;

	this.onLoadComplete = function () {};

	this.loadCounter = 0;

	this.loadParts = function ( config ) {

		this.loadCounter = config.weapons.length * 2 + config.skins.length + 1;

		var weaponsTextures = [];
		for ( var i = 0; i < config.weapons.length; i ++ ) weaponsTextures[ i ] = config.weapons[ i ][ 1 ];
		// SKINS

		this.skinsBody = loadTextures( config.baseUrl + "skins/", config.skins );
		this.skinsWeapon = loadTextures( config.baseUrl + "skins/", weaponsTextures );

		// BODY

		var loader = new THREE.MD2Loader();

		loader.load( config.baseUrl + config.body, function( geo ) {

			geo.computeBoundingBox();
			scope.root.position.y = - scope.scale * geo.boundingBox.min.y;

			var mesh = createPart( geo, scope.skinsBody[ 0 ] );
			mesh.scale.set( scope.scale, scope.scale, scope.scale );

			scope.root.add( mesh );

			scope.meshBody = mesh;

			scope.meshBody.clipOffset = 0;
			scope.activeAnimationClipName = mesh.geometry.animations[0].name;

			scope.mixer = new THREE.AnimationMixer( mesh );

			checkLoadingComplete();

		} );

		// WEAPONS

		var generateCallback = function ( index, name ) {

			return function( geo ) {

				var mesh = createPart( geo, scope.skinsWeapon[ index ] );
				mesh.scale.set( scope.scale, scope.scale, scope.scale );
				mesh.visible = false;

				mesh.name = name;

				scope.root.add( mesh );

				scope.weapons[ index ] = mesh;
				scope.meshWeapon = mesh;

				checkLoadingComplete();

			}

		};

		for ( var i = 0; i < config.weapons.length; i ++ ) {

			loader.load( config.baseUrl + config.weapons[ i ][ 0 ], generateCallback( i, config.weapons[ i ][ 0 ] ) );

		}

	};

	this.setPlaybackRate = function ( rate ) {

		if( rate !== 0 ) {
			this.mixer.timeScale = 1 / rate;
		}
		else {
			this.mixer.timeScale = 0;
		}

	};

	this.setWireframe = function ( wireframeEnabled ) {

		if ( wireframeEnabled ) {

			if ( this.meshBody ) this.meshBody.material = this.meshBody.materialWireframe;
			if ( this.meshWeapon ) this.meshWeapon.material = this.meshWeapon.materialWireframe;

		} else {

			if ( this.meshBody ) this.meshBody.material = this.meshBody.materialTexture;
			if ( this.meshWeapon ) this.meshWeapon.material = this.meshWeapon.materialTexture;

		}

	};

	this.setSkin = function( index ) {

		if ( this.meshBody && this.meshBody.material.wireframe === false ) {

			this.meshBody.material.map = this.skinsBody[ index ];

		}

	};

	this.setWeapon = function ( index ) {

		for ( var i = 0; i < this.weapons.length; i ++ ) this.weapons[ i ].visible = false;

		var activeWeapon = this.weapons[ index ];

		if ( activeWeapon ) {

			activeWeapon.visible = true;
			this.meshWeapon = activeWeapon;

			scope.syncWeaponAnimation();

		}

	};

	this.setAnimation = function ( clipName ) {

		if ( this.meshBody ) {

			if( this.meshBody.activeAction ) {
				this.meshBody.activeAction.stop();
				this.meshBody.activeAction = null;
			}

			var action = this.mixer.clipAction( clipName, this.meshBody );
			if( action ) {

				this.meshBody.activeAction = action.play();

			}

		}

		scope.activeClipName = clipName;

		scope.syncWeaponAnimation();

	};

	this.syncWeaponAnimation = function() {

		var clipName = scope.activeClipName;

		if ( scope.meshWeapon ) {

			if( this.meshWeapon.activeAction ) {
				this.meshWeapon.activeAction.stop();
				this.meshWeapon.activeAction = null;
			}

			var geometry = this.meshWeapon.geometry,
				animations = geometry.animations;

			var action = this.mixer.clipAction( clipName, this.meshWeapon );
			if( action ) {

				this.meshWeapon.activeAction =
						action.syncWith( this.meshBody.activeAction ).play();

			}

		}

	}

	this.update = function ( delta ) {

		if( this.mixer ) this.mixer.update( delta );

	};

	function loadTextures( baseUrl, textureUrls ) {

		var textureLoader = new THREE.TextureLoader();
		var textures = [];

		for ( var i = 0; i < textureUrls.length; i ++ ) {

			textures[ i ] = textureLoader.load( baseUrl + textureUrls[ i ], checkLoadingComplete );
			textures[ i ].mapping = THREE.UVMapping;
			textures[ i ].name = textureUrls[ i ];

		}

		return textures;

	}

	function createPart( geometry, skinMap ) {

		var materialWireframe = new THREE.MeshLambertMaterial( { color: 0xffaa00, wireframe: true, morphTargets: true, morphNormals: true } );
		var materialTexture = new THREE.MeshLambertMaterial( { color: 0xffffff, wireframe: false, map: skinMap, morphTargets: true, morphNormals: true } );

		//

		var mesh = new THREE.Mesh( geometry, materialTexture );
		mesh.rotation.y = - Math.PI / 2;

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		//

		mesh.materialTexture = materialTexture;
		mesh.materialWireframe = materialWireframe;

		return mesh;

	}

	function checkLoadingComplete() {

		scope.loadCounter -= 1;

		if ( scope.loadCounter === 0 ) scope.onLoadComplete();

	}

};

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.MD2CharacterComplex = function () {

	var scope = this;

	this.scale = 1;

	// animation parameters

	this.animationFPS = 6;
	this.transitionFrames = 15;

	// movement model parameters

	this.maxSpeed = 275;
	this.maxReverseSpeed = - 275;

	this.frontAcceleration = 600;
	this.backAcceleration = 600;

	this.frontDecceleration = 600;

	this.angularSpeed = 2.5;

	// rig

	this.root = new THREE.Object3D();

	this.meshBody = null;
	this.meshWeapon = null;

	this.controls = null;

	// skins

	this.skinsBody = [];
	this.skinsWeapon = [];

	this.weapons = [];

	this.currentSkin = undefined;

	//

	this.onLoadComplete = function () {};

	// internals

	this.meshes = [];
	this.animations = {};

	this.loadCounter = 0;

	// internal movement control variables

	this.speed = 0;
	this.bodyOrientation = 0;

	this.walkSpeed = this.maxSpeed;
	this.crouchSpeed = this.maxSpeed * 0.5;

	// internal animation parameters

	this.activeAnimation = null;
	this.oldAnimation = null;

	// API

	this.enableShadows = function ( enable ) {

		for ( var i = 0; i < this.meshes.length; i ++ ) {

			this.meshes[ i ].castShadow = enable;
			this.meshes[ i ].receiveShadow = enable;

		}

	};

	this.setVisible = function ( enable ) {

		for ( var i = 0; i < this.meshes.length; i ++ ) {

			this.meshes[ i ].visible = enable;
			this.meshes[ i ].visible = enable;

		}

	};


	this.shareParts = function ( original ) {

		this.animations = original.animations;
		this.walkSpeed = original.walkSpeed;
		this.crouchSpeed = original.crouchSpeed;

		this.skinsBody = original.skinsBody;
		this.skinsWeapon = original.skinsWeapon;

		// BODY

		var mesh = createPart( original.meshBody.geometry, this.skinsBody[ 0 ] );
		mesh.scale.set( this.scale, this.scale, this.scale );

		this.root.position.y = original.root.position.y;
		this.root.add( mesh );

		this.meshBody = mesh;

		this.meshes.push( mesh );

		// WEAPONS

		for ( var i = 0; i < original.weapons.length; i ++ ) {

			var meshWeapon = createPart( original.weapons[ i ].geometry, this.skinsWeapon[ i ] );
			meshWeapon.scale.set( this.scale, this.scale, this.scale );
			meshWeapon.visible = false;

			meshWeapon.name = original.weapons[ i ].name;

			this.root.add( meshWeapon );

			this.weapons[ i ] = meshWeapon;
			this.meshWeapon = meshWeapon;

			this.meshes.push( meshWeapon );

		}

	};

	this.loadParts = function ( config ) {

		this.animations = config.animations;
		this.walkSpeed = config.walkSpeed;
		this.crouchSpeed = config.crouchSpeed;

		this.loadCounter = config.weapons.length * 2 + config.skins.length + 1;

		var weaponsTextures = [];
		for ( var i = 0; i < config.weapons.length; i ++ ) weaponsTextures[ i ] = config.weapons[ i ][ 1 ];

		// SKINS

		this.skinsBody = loadTextures( config.baseUrl + "skins/", config.skins );
		this.skinsWeapon = loadTextures( config.baseUrl + "skins/", weaponsTextures );

		// BODY

		var loader = new THREE.MD2Loader();

		loader.load( config.baseUrl + config.body, function( geo ) {

			geo.computeBoundingBox();
			scope.root.position.y = - scope.scale * geo.boundingBox.min.y;

			var mesh = createPart( geo, scope.skinsBody[ 0 ] );
			mesh.scale.set( scope.scale, scope.scale, scope.scale );

			scope.root.add( mesh );

			scope.meshBody = mesh;
			scope.meshes.push( mesh );

			checkLoadingComplete();

		} );

		// WEAPONS

		var generateCallback = function ( index, name ) {

			return function( geo ) {

				var mesh = createPart( geo, scope.skinsWeapon[ index ] );
				mesh.scale.set( scope.scale, scope.scale, scope.scale );
				mesh.visible = false;

				mesh.name = name;

				scope.root.add( mesh );

				scope.weapons[ index ] = mesh;
				scope.meshWeapon = mesh;
				scope.meshes.push( mesh );

				checkLoadingComplete();

			}

		};

		for ( var i = 0; i < config.weapons.length; i ++ ) {

			loader.load( config.baseUrl + config.weapons[ i ][ 0 ], generateCallback( i, config.weapons[ i ][ 0 ] ) );

		}

	};

	this.setPlaybackRate = function ( rate ) {

		if ( this.meshBody ) this.meshBody.duration = this.meshBody.baseDuration / rate;
		if ( this.meshWeapon ) this.meshWeapon.duration = this.meshWeapon.baseDuration / rate;

	};

	this.setWireframe = function ( wireframeEnabled ) {

		if ( wireframeEnabled ) {

			if ( this.meshBody ) this.meshBody.material = this.meshBody.materialWireframe;
			if ( this.meshWeapon ) this.meshWeapon.material = this.meshWeapon.materialWireframe;

		} else {

			if ( this.meshBody ) this.meshBody.material = this.meshBody.materialTexture;
			if ( this.meshWeapon ) this.meshWeapon.material = this.meshWeapon.materialTexture;

		}

	};

	this.setSkin = function( index ) {

		if ( this.meshBody && this.meshBody.material.wireframe === false ) {

			this.meshBody.material.map = this.skinsBody[ index ];
			this.currentSkin = index;

		}

	};

	this.setWeapon = function ( index ) {

		for ( var i = 0; i < this.weapons.length; i ++ ) this.weapons[ i ].visible = false;

		var activeWeapon = this.weapons[ index ];

		if ( activeWeapon ) {

			activeWeapon.visible = true;
			this.meshWeapon = activeWeapon;

			if ( this.activeAnimation ) {

				activeWeapon.playAnimation( this.activeAnimation );
				this.meshWeapon.setAnimationTime( this.activeAnimation, this.meshBody.getAnimationTime( this.activeAnimation ) );

			}

		}

	};

	this.setAnimation = function ( animationName ) {

		if ( animationName === this.activeAnimation || ! animationName ) return;

		if ( this.meshBody ) {

			this.meshBody.setAnimationWeight( animationName, 0 );
			this.meshBody.playAnimation( animationName );

			this.oldAnimation = this.activeAnimation;
			this.activeAnimation = animationName;

			this.blendCounter = this.transitionFrames;

		}

		if ( this.meshWeapon ) {

			this.meshWeapon.setAnimationWeight( animationName, 0 );
			this.meshWeapon.playAnimation( animationName );

		}


	};

	this.update = function ( delta ) {

		if ( this.controls ) this.updateMovementModel( delta );

		if ( this.animations ) {

			this.updateBehaviors( delta );
			this.updateAnimations( delta );

		}

	};

	this.updateAnimations = function ( delta ) {

		var mix = 1;

		if ( this.blendCounter > 0 ) {

			mix = ( this.transitionFrames - this.blendCounter ) / this.transitionFrames;
			this.blendCounter -= 1;

		}

		if ( this.meshBody ) {

			this.meshBody.update( delta );

			this.meshBody.setAnimationWeight( this.activeAnimation, mix );
			this.meshBody.setAnimationWeight( this.oldAnimation,  1 - mix );

		}

		if ( this.meshWeapon ) {

			this.meshWeapon.update( delta );

			this.meshWeapon.setAnimationWeight( this.activeAnimation, mix );
			this.meshWeapon.setAnimationWeight( this.oldAnimation,  1 - mix );

		}

	};

	this.updateBehaviors = function ( delta ) {

		var controls = this.controls;
		var animations = this.animations;

		var moveAnimation, idleAnimation;

		// crouch vs stand

		if ( controls.crouch ) {

			moveAnimation = animations[ "crouchMove" ];
			idleAnimation = animations[ "crouchIdle" ];

		} else {

			moveAnimation = animations[ "move" ];
			idleAnimation = animations[ "idle" ];

		}

		// actions

		if ( controls.jump ) {

			moveAnimation = animations[ "jump" ];
			idleAnimation = animations[ "jump" ];

		}

		if ( controls.attack ) {

			if ( controls.crouch ) {

				moveAnimation = animations[ "crouchAttack" ];
				idleAnimation = animations[ "crouchAttack" ];

			} else {

				moveAnimation = animations[ "attack" ];
				idleAnimation = animations[ "attack" ];

			}

		}

		// set animations

		if ( controls.moveForward || controls.moveBackward || controls.moveLeft || controls.moveRight ) {

			if ( this.activeAnimation !== moveAnimation ) {

				this.setAnimation( moveAnimation );

			}

		}


		if ( Math.abs( this.speed ) < 0.2 * this.maxSpeed && ! ( controls.moveLeft || controls.moveRight || controls.moveForward || controls.moveBackward ) ) {

			if ( this.activeAnimation !== idleAnimation ) {

				this.setAnimation( idleAnimation );

			}

		}

		// set animation direction

		if ( controls.moveForward ) {

			if ( this.meshBody ) {

				this.meshBody.setAnimationDirectionForward( this.activeAnimation );
				this.meshBody.setAnimationDirectionForward( this.oldAnimation );

			}

			if ( this.meshWeapon ) {

				this.meshWeapon.setAnimationDirectionForward( this.activeAnimation );
				this.meshWeapon.setAnimationDirectionForward( this.oldAnimation );

			}

		}

		if ( controls.moveBackward ) {

			if ( this.meshBody ) {

				this.meshBody.setAnimationDirectionBackward( this.activeAnimation );
				this.meshBody.setAnimationDirectionBackward( this.oldAnimation );

			}

			if ( this.meshWeapon ) {

				this.meshWeapon.setAnimationDirectionBackward( this.activeAnimation );
				this.meshWeapon.setAnimationDirectionBackward( this.oldAnimation );

			}

		}

	};

	this.updateMovementModel = function ( delta ) {

		var controls = this.controls;

		// speed based on controls

		if ( controls.crouch ) 	this.maxSpeed = this.crouchSpeed;
		else this.maxSpeed = this.walkSpeed;

		this.maxReverseSpeed = - this.maxSpeed;

		if ( controls.moveForward )  this.speed = THREE.Math.clamp( this.speed + delta * this.frontAcceleration, this.maxReverseSpeed, this.maxSpeed );
		if ( controls.moveBackward ) this.speed = THREE.Math.clamp( this.speed - delta * this.backAcceleration, this.maxReverseSpeed, this.maxSpeed );

		// orientation based on controls
		// (don't just stand while turning)

		var dir = 1;

		if ( controls.moveLeft ) {

			this.bodyOrientation += delta * this.angularSpeed;
			this.speed = THREE.Math.clamp( this.speed + dir * delta * this.frontAcceleration, this.maxReverseSpeed, this.maxSpeed );

		}

		if ( controls.moveRight ) {

			this.bodyOrientation -= delta * this.angularSpeed;
			this.speed = THREE.Math.clamp( this.speed + dir * delta * this.frontAcceleration, this.maxReverseSpeed, this.maxSpeed );

		}

		// speed decay

		if ( ! ( controls.moveForward || controls.moveBackward ) ) {

			if ( this.speed > 0 ) {

				var k = exponentialEaseOut( this.speed / this.maxSpeed );
				this.speed = THREE.Math.clamp( this.speed - k * delta * this.frontDecceleration, 0, this.maxSpeed );

			} else {

				var k = exponentialEaseOut( this.speed / this.maxReverseSpeed );
				this.speed = THREE.Math.clamp( this.speed + k * delta * this.backAcceleration, this.maxReverseSpeed, 0 );

			}

		}

		// displacement

		var forwardDelta = this.speed * delta;

		this.root.position.x += Math.sin( this.bodyOrientation ) * forwardDelta;
		this.root.position.z += Math.cos( this.bodyOrientation ) * forwardDelta;

		// steering

		this.root.rotation.y = this.bodyOrientation;

	};

	// internal helpers

	function loadTextures( baseUrl, textureUrls ) {

		var textureLoader = new THREE.TextureLoader();
		var textures = [];

		for ( var i = 0; i < textureUrls.length; i ++ ) {

			textures[ i ] = textureLoader.load( baseUrl + textureUrls[ i ], checkLoadingComplete );
			textures[ i ].mapping = THREE.UVMapping;
			textures[ i ].name = textureUrls[ i ];

		}

		return textures;

	}

	function createPart( geometry, skinMap ) {

		var materialWireframe = new THREE.MeshLambertMaterial( { color: 0xffaa00, wireframe: true, morphTargets: true, morphNormals: true } );
		var materialTexture = new THREE.MeshLambertMaterial( { color: 0xffffff, wireframe: false, map: skinMap, morphTargets: true, morphNormals: true } );

		//

		var mesh = new THREE.MorphBlendMesh( geometry, materialTexture );
		mesh.rotation.y = - Math.PI / 2;

		//

		mesh.materialTexture = materialTexture;
		mesh.materialWireframe = materialWireframe;

		//

		mesh.autoCreateAnimations( scope.animationFPS );

		return mesh;

	}

	function checkLoadingComplete() {

		scope.loadCounter -= 1;
		if ( scope.loadCounter === 0 ) 	scope.onLoadComplete();

	}

	function exponentialEaseOut( k ) {

		return k === 1 ? 1 : - Math.pow( 2, - 10 * k ) + 1;

	}

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Port of greggman's ThreeD version of marching cubes to Three.js
 * http://webglsamples.googlecode.com/hg/blob/blob.html
 */

THREE.MarchingCubes = function ( resolution, material, enableUvs, enableColors ) {

	THREE.ImmediateRenderObject.call( this, material );

	this.enableUvs = enableUvs !== undefined ? enableUvs : false;
	this.enableColors = enableColors !== undefined ? enableColors : false;

	// functions have to be object properties
	// prototype functions kill performance
	// (tested and it was 4x slower !!!)

	this.init = function ( resolution ) {

		this.resolution = resolution;

		// parameters

		this.isolation = 80.0;

		// size of field, 32 is pushing it in Javascript :)

		this.size = resolution;
		this.size2 = this.size * this.size;
		this.size3 = this.size2 * this.size;
		this.halfsize = this.size / 2.0;

		// deltas

		this.delta = 2.0 / this.size;
		this.yd = this.size;
		this.zd = this.size2;

		this.field = new Float32Array( this.size3 );
		this.normal_cache = new Float32Array( this.size3 * 3 );

		// temp buffers used in polygonize

		this.vlist = new Float32Array( 12 * 3 );
		this.nlist = new Float32Array( 12 * 3 );

		// immediate render mode simulator

		this.maxCount = 4096; // TODO: find the fastest size for this buffer
		this.count = 0;

		this.hasPositions = false;
		this.hasNormals = false;
		this.hasColors = false;
		this.hasUvs = false;

		this.positionArray = new Float32Array( this.maxCount * 3 );
		this.normalArray   = new Float32Array( this.maxCount * 3 );

		if ( this.enableUvs ) {

			this.uvArray = new Float32Array( this.maxCount * 2 );

		}

		if ( this.enableColors ) {

			this.colorArray   = new Float32Array( this.maxCount * 3 );

		}

	};

	///////////////////////
	// Polygonization
	///////////////////////

	this.lerp = function( a, b, t ) {

		return a + ( b - a ) * t;

	};

	this.VIntX = function( q, pout, nout, offset, isol, x, y, z, valp1, valp2 ) {

		var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
		nc = this.normal_cache;

		pout[ offset ] 	   = x + mu * this.delta;
		pout[ offset + 1 ] = y;
		pout[ offset + 2 ] = z;

		nout[ offset ] 	   = this.lerp( nc[ q ],     nc[ q + 3 ], mu );
		nout[ offset + 1 ] = this.lerp( nc[ q + 1 ], nc[ q + 4 ], mu );
		nout[ offset + 2 ] = this.lerp( nc[ q + 2 ], nc[ q + 5 ], mu );

	};

	this.VIntY = function( q, pout, nout, offset, isol, x, y, z, valp1, valp2 ) {

		var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
		nc = this.normal_cache;

		pout[ offset ] 	   = x;
		pout[ offset + 1 ] = y + mu * this.delta;
		pout[ offset + 2 ] = z;

		var q2 = q + this.yd * 3;

		nout[ offset ] 	   = this.lerp( nc[ q ],     nc[ q2 ],     mu );
		nout[ offset + 1 ] = this.lerp( nc[ q + 1 ], nc[ q2 + 1 ], mu );
		nout[ offset + 2 ] = this.lerp( nc[ q + 2 ], nc[ q2 + 2 ], mu );

	};

	this.VIntZ = function( q, pout, nout, offset, isol, x, y, z, valp1, valp2 ) {

		var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
		nc = this.normal_cache;

		pout[ offset ] 	   = x;
		pout[ offset + 1 ] = y;
		pout[ offset + 2 ] = z + mu * this.delta;

		var q2 = q + this.zd * 3;

		nout[ offset ] 	   = this.lerp( nc[ q ],     nc[ q2 ],     mu );
		nout[ offset + 1 ] = this.lerp( nc[ q + 1 ], nc[ q2 + 1 ], mu );
		nout[ offset + 2 ] = this.lerp( nc[ q + 2 ], nc[ q2 + 2 ], mu );

	};

	this.compNorm = function( q ) {

		var q3 = q * 3;

		if ( this.normal_cache[ q3 ] === 0.0 ) {

			this.normal_cache[ q3 ] = this.field[ q - 1 ] 	    - this.field[ q + 1 ];
			this.normal_cache[ q3 + 1 ] = this.field[ q - this.yd ] - this.field[ q + this.yd ];
			this.normal_cache[ q3 + 2 ] = this.field[ q - this.zd ] - this.field[ q + this.zd ];

		}

	};

	// Returns total number of triangles. Fills triangles.
	// (this is where most of time is spent - it's inner work of O(n3) loop )

	this.polygonize = function( fx, fy, fz, q, isol, renderCallback ) {

		// cache indices
		var q1 = q + 1,
			qy = q + this.yd,
			qz = q + this.zd,
			q1y = q1 + this.yd,
			q1z = q1 + this.zd,
			qyz = q + this.yd + this.zd,
			q1yz = q1 + this.yd + this.zd;

		var cubeindex = 0,
			field0 = this.field[ q ],
			field1 = this.field[ q1 ],
			field2 = this.field[ qy ],
			field3 = this.field[ q1y ],
			field4 = this.field[ qz ],
			field5 = this.field[ q1z ],
			field6 = this.field[ qyz ],
			field7 = this.field[ q1yz ];

		if ( field0 < isol ) cubeindex |= 1;
		if ( field1 < isol ) cubeindex |= 2;
		if ( field2 < isol ) cubeindex |= 8;
		if ( field3 < isol ) cubeindex |= 4;
		if ( field4 < isol ) cubeindex |= 16;
		if ( field5 < isol ) cubeindex |= 32;
		if ( field6 < isol ) cubeindex |= 128;
		if ( field7 < isol ) cubeindex |= 64;

		// if cube is entirely in/out of the surface - bail, nothing to draw

		var bits = THREE.edgeTable[ cubeindex ];
		if ( bits === 0 ) return 0;

		var d = this.delta,
			fx2 = fx + d,
			fy2 = fy + d,
			fz2 = fz + d;

		// top of the cube

		if ( bits & 1 ) {

			this.compNorm( q );
			this.compNorm( q1 );
			this.VIntX( q * 3, this.vlist, this.nlist, 0, isol, fx, fy, fz, field0, field1 );

		}

		if ( bits & 2 ) {

			this.compNorm( q1 );
			this.compNorm( q1y );
			this.VIntY( q1 * 3, this.vlist, this.nlist, 3, isol, fx2, fy, fz, field1, field3 );

		}

		if ( bits & 4 ) {

			this.compNorm( qy );
			this.compNorm( q1y );
			this.VIntX( qy * 3, this.vlist, this.nlist, 6, isol, fx, fy2, fz, field2, field3 );

		}

		if ( bits & 8 ) {

			this.compNorm( q );
			this.compNorm( qy );
			this.VIntY( q * 3, this.vlist, this.nlist, 9, isol, fx, fy, fz, field0, field2 );

		}

		// bottom of the cube

		if ( bits & 16 ) {

			this.compNorm( qz );
			this.compNorm( q1z );
			this.VIntX( qz * 3, this.vlist, this.nlist, 12, isol, fx, fy, fz2, field4, field5 );

		}

		if ( bits & 32 ) {

			this.compNorm( q1z );
			this.compNorm( q1yz );
			this.VIntY( q1z * 3,  this.vlist, this.nlist, 15, isol, fx2, fy, fz2, field5, field7 );

		}

		if ( bits & 64 ) {

			this.compNorm( qyz );
			this.compNorm( q1yz );
			this.VIntX( qyz * 3, this.vlist, this.nlist, 18, isol, fx, fy2, fz2, field6, field7 );

		}

		if ( bits & 128 ) {

			this.compNorm( qz );
			this.compNorm( qyz );
			this.VIntY( qz * 3,  this.vlist, this.nlist, 21, isol, fx, fy, fz2, field4, field6 );

		}

		// vertical lines of the cube

		if ( bits & 256 ) {

			this.compNorm( q );
			this.compNorm( qz );
			this.VIntZ( q * 3, this.vlist, this.nlist, 24, isol, fx, fy, fz, field0, field4 );

		}

		if ( bits & 512 ) {

			this.compNorm( q1 );
			this.compNorm( q1z );
			this.VIntZ( q1 * 3,  this.vlist, this.nlist, 27, isol, fx2, fy,  fz, field1, field5 );

		}

		if ( bits & 1024 ) {

			this.compNorm( q1y );
			this.compNorm( q1yz );
			this.VIntZ( q1y * 3, this.vlist, this.nlist, 30, isol, fx2, fy2, fz, field3, field7 );

		}

		if ( bits & 2048 ) {

			this.compNorm( qy );
			this.compNorm( qyz );
			this.VIntZ( qy * 3, this.vlist, this.nlist, 33, isol, fx,  fy2, fz, field2, field6 );

		}

		cubeindex <<= 4;  // re-purpose cubeindex into an offset into triTable

		var o1, o2, o3, numtris = 0, i = 0;

		// here is where triangles are created

		while ( THREE.triTable[ cubeindex + i ] != - 1 ) {

			o1 = cubeindex + i;
			o2 = o1 + 1;
			o3 = o1 + 2;

			this.posnormtriv( this.vlist, this.nlist,
							  3 * THREE.triTable[ o1 ],
							  3 * THREE.triTable[ o2 ],
							  3 * THREE.triTable[ o3 ],
							  renderCallback );

			i += 3;
			numtris ++;

		}

		return numtris;

	};

	/////////////////////////////////////
	// Immediate render mode simulator
	/////////////////////////////////////

	this.posnormtriv = function( pos, norm, o1, o2, o3, renderCallback ) {

		var c = this.count * 3;

		// positions

		this.positionArray[ c ] 	= pos[ o1 ];
		this.positionArray[ c + 1 ] = pos[ o1 + 1 ];
		this.positionArray[ c + 2 ] = pos[ o1 + 2 ];

		this.positionArray[ c + 3 ] = pos[ o2 ];
		this.positionArray[ c + 4 ] = pos[ o2 + 1 ];
		this.positionArray[ c + 5 ] = pos[ o2 + 2 ];

		this.positionArray[ c + 6 ] = pos[ o3 ];
		this.positionArray[ c + 7 ] = pos[ o3 + 1 ];
		this.positionArray[ c + 8 ] = pos[ o3 + 2 ];

		// normals

		this.normalArray[ c ] 	  = norm[ o1 ];
		this.normalArray[ c + 1 ] = norm[ o1 + 1 ];
		this.normalArray[ c + 2 ] = norm[ o1 + 2 ];

		this.normalArray[ c + 3 ] = norm[ o2 ];
		this.normalArray[ c + 4 ] = norm[ o2 + 1 ];
		this.normalArray[ c + 5 ] = norm[ o2 + 2 ];

		this.normalArray[ c + 6 ] = norm[ o3 ];
		this.normalArray[ c + 7 ] = norm[ o3 + 1 ];
		this.normalArray[ c + 8 ] = norm[ o3 + 2 ];

		// uvs

		if ( this.enableUvs ) {

			var d = this.count * 2;

			this.uvArray[ d ] 	  = pos[ o1 ];
			this.uvArray[ d + 1 ] = pos[ o1 + 2 ];

			this.uvArray[ d + 2 ] = pos[ o2 ];
			this.uvArray[ d + 3 ] = pos[ o2 + 2 ];

			this.uvArray[ d + 4 ] = pos[ o3 ];
			this.uvArray[ d + 5 ] = pos[ o3 + 2 ];

		}

		// colors

		if ( this.enableColors ) {

			this.colorArray[ c ] 	 = pos[ o1 ];
			this.colorArray[ c + 1 ] = pos[ o1 + 1 ];
			this.colorArray[ c + 2 ] = pos[ o1 + 2 ];

			this.colorArray[ c + 3 ] = pos[ o2 ];
			this.colorArray[ c + 4 ] = pos[ o2 + 1 ];
			this.colorArray[ c + 5 ] = pos[ o2 + 2 ];

			this.colorArray[ c + 6 ] = pos[ o3 ];
			this.colorArray[ c + 7 ] = pos[ o3 + 1 ];
			this.colorArray[ c + 8 ] = pos[ o3 + 2 ];

		}

		this.count += 3;

		if ( this.count >= this.maxCount - 3 ) {

			this.hasPositions = true;
			this.hasNormals = true;

			if ( this.enableUvs ) {

				this.hasUvs = true;

			}

			if ( this.enableColors ) {

				this.hasColors = true;

			}

			renderCallback( this );

		}

	};

	this.begin = function( ) {

		this.count = 0;

		this.hasPositions = false;
		this.hasNormals = false;
		this.hasUvs = false;
		this.hasColors = false;

	};

	this.end = function( renderCallback ) {

		if ( this.count === 0 ) return;

		for ( var i = this.count * 3; i < this.positionArray.length; i ++ ) {

			this.positionArray[ i ] = 0.0;

		}

		this.hasPositions = true;
		this.hasNormals = true;

		if ( this.enableUvs ) {

			this.hasUvs = true;

		}

		if ( this.enableColors ) {

			this.hasColors = true;

		}

		renderCallback( this );

	};

	/////////////////////////////////////
	// Metaballs
	/////////////////////////////////////

	// Adds a reciprocal ball (nice and blobby) that, to be fast, fades to zero after
	// a fixed distance, determined by strength and subtract.

	this.addBall = function( ballx, bally, ballz, strength, subtract ) {

		// Let's solve the equation to find the radius:
		// 1.0 / (0.000001 + radius^2) * strength - subtract = 0
		// strength / (radius^2) = subtract
		// strength = subtract * radius^2
		// radius^2 = strength / subtract
		// radius = sqrt(strength / subtract)

		var radius = this.size * Math.sqrt( strength / subtract ),
			zs = ballz * this.size,
			ys = bally * this.size,
			xs = ballx * this.size;

		var min_z = Math.floor( zs - radius ); if ( min_z < 1 ) min_z = 1;
		var max_z = Math.floor( zs + radius ); if ( max_z > this.size - 1 ) max_z = this.size - 1;
		var min_y = Math.floor( ys - radius ); if ( min_y < 1 ) min_y = 1;
		var max_y = Math.floor( ys + radius ); if ( max_y > this.size - 1 ) max_y = this.size - 1;
		var min_x = Math.floor( xs - radius ); if ( min_x < 1  ) min_x = 1;
		var max_x = Math.floor( xs + radius ); if ( max_x > this.size - 1 ) max_x = this.size - 1;


		// Don't polygonize in the outer layer because normals aren't
		// well-defined there.

		var x, y, z, y_offset, z_offset, fx, fy, fz, fz2, fy2, val;

		for ( z = min_z; z < max_z; z ++ ) {

			z_offset = this.size2 * z,
			fz = z / this.size - ballz,
			fz2 = fz * fz;

			for ( y = min_y; y < max_y; y ++ ) {

				y_offset = z_offset + this.size * y;
				fy = y / this.size - bally;
				fy2 = fy * fy;

				for ( x = min_x; x < max_x; x ++ ) {

					fx = x / this.size - ballx;
					val = strength / ( 0.000001 + fx * fx + fy2 + fz2 ) - subtract;
					if ( val > 0.0 ) this.field[ y_offset + x ] += val;

				}

			}

		}

	};

	this.addPlaneX = function( strength, subtract ) {

		var x, y, z, xx, val, xdiv, cxy,

			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,

			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( x = 0; x < dist; x ++ ) {

			xdiv = x / size;
			xx = xdiv * xdiv;
			val = strength / ( 0.0001 + xx ) - subtract;

			if ( val > 0.0 ) {

				for ( y = 0; y < size; y ++ ) {

					cxy = x + y * yd;

					for ( z = 0; z < size; z ++ ) {

						field[ zd * z + cxy ] += val;

					}

				}

			}

		}

	};

	this.addPlaneY = function( strength, subtract ) {

		var x, y, z, yy, val, ydiv, cy, cxy,

			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,

			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( y = 0; y < dist; y ++ ) {

			ydiv = y / size;
			yy = ydiv * ydiv;
			val = strength / ( 0.0001 + yy ) - subtract;

			if ( val > 0.0 ) {

				cy = y * yd;

				for ( x = 0; x < size; x ++ ) {

					cxy = cy + x;

					for ( z = 0; z < size; z ++ )
						field[ zd * z + cxy ] += val;

				}

			}

		}

	};

	this.addPlaneZ = function( strength, subtract ) {

		var x, y, z, zz, val, zdiv, cz, cyz,

			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,

			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( z = 0; z < dist; z ++ ) {

			zdiv = z / size;
			zz = zdiv * zdiv;
			val = strength / ( 0.0001 + zz ) - subtract;
			if ( val > 0.0 ) {

				cz = zd * z;

				for ( y = 0; y < size; y ++ ) {

					cyz = cz + y * yd;

					for ( x = 0; x < size; x ++ )
						field[ cyz + x ] += val;

				}

			}

		}

	};

	/////////////////////////////////////
	// Updates
	/////////////////////////////////////

	this.reset = function () {

		var i;

		// wipe the normal cache

		for ( i = 0; i < this.size3; i ++ ) {

			this.normal_cache[ i * 3 ] = 0.0;
			this.field[ i ] = 0.0;

		}

	};

	this.render = function ( renderCallback ) {

		this.begin();

		// Triangulate. Yeah, this is slow.

		var smin2 = this.size - 2;

		for ( var z = 1; z < smin2; z ++ ) {

			var z_offset = this.size2 * z;
			var fz = ( z - this.halfsize ) / this.halfsize; //+ 1

			for ( var y = 1; y < smin2; y ++ ) {

				var y_offset = z_offset + this.size * y;
				var fy = ( y - this.halfsize ) / this.halfsize; //+ 1

				for ( var x = 1; x < smin2; x ++ ) {

					var fx = ( x - this.halfsize ) / this.halfsize; //+ 1
					var q = y_offset + x;

					this.polygonize( fx, fy, fz, q, this.isolation, renderCallback );

				}

			}

		}

		this.end( renderCallback );

	};

	this.generateGeometry = function() {

		var start = 0, geo = new THREE.Geometry();
		var normals = [];

		var geo_callback = function( object ) {

			var i, x, y, z, vertex, normal,
				face, a, b, c, na, nb, nc, nfaces;


			for ( i = 0; i < object.count; i ++ ) {

				a = i * 3;
				b = a + 1;
				c = a + 2;

				x = object.positionArray[ a ];
				y = object.positionArray[ b ];
				z = object.positionArray[ c ];
				vertex = new THREE.Vector3( x, y, z );

				x = object.normalArray[ a ];
				y = object.normalArray[ b ];
				z = object.normalArray[ c ];
				normal = new THREE.Vector3( x, y, z );
				normal.normalize();

				geo.vertices.push( vertex );
				normals.push( normal );

			}

			nfaces = object.count / 3;

			for ( i = 0; i < nfaces; i ++ ) {

				a = ( start + i ) * 3;
				b = a + 1;
				c = a + 2;

				na = normals[ a ];
				nb = normals[ b ];
				nc = normals[ c ];

				face = new THREE.Face3( a, b, c, [ na, nb, nc ] );

				geo.faces.push( face );

			}

			start += nfaces;
			object.count = 0;

		};

		this.render( geo_callback );

		// console.log( "generated " + geo.faces.length + " triangles" );

		return geo;

	};

	this.init( resolution );

};

THREE.MarchingCubes.prototype = Object.create( THREE.ImmediateRenderObject.prototype );
THREE.MarchingCubes.prototype.constructor = THREE.MarchingCubes;


/////////////////////////////////////
// Marching cubes lookup tables
/////////////////////////////////////

// These tables are straight from Paul Bourke's page:
// http://local.wasp.uwa.edu.au/~pbourke/geometry/polygonise/
// who in turn got them from Cory Gene Bloyd.

THREE.edgeTable = new Int32Array( [
0x0, 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c,
0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00,
0x190, 0x99, 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c,
0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90,
0x230, 0x339, 0x33, 0x13a, 0x636, 0x73f, 0x435, 0x53c,
0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30,
0x3a0, 0x2a9, 0x1a3, 0xaa, 0x7a6, 0x6af, 0x5a5, 0x4ac,
0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0,
0x460, 0x569, 0x663, 0x76a, 0x66, 0x16f, 0x265, 0x36c,
0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60,
0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff, 0x3f5, 0x2fc,
0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0,
0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f, 0x55, 0x15c,
0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950,
0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc,
0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0,
0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc,
0xcc, 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0,
0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c,
0x15c, 0x55, 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650,
0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc,
0x2fc, 0x3f5, 0xff, 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c,
0x36c, 0x265, 0x16f, 0x66, 0x76a, 0x663, 0x569, 0x460,
0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac,
0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa, 0x1a3, 0x2a9, 0x3a0,
0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c,
0x53c, 0x435, 0x73f, 0x636, 0x13a, 0x33, 0x339, 0x230,
0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c,
0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99, 0x190,
0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c,
0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109, 0x0 ] );

THREE.triTable = new Int32Array( [
- 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 8, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 1, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 8, 3, 9, 8, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 2, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 8, 3, 1, 2, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 2, 10, 0, 2, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
2, 8, 3, 2, 10, 8, 10, 9, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
3, 11, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 11, 2, 8, 11, 0, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 9, 0, 2, 3, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 11, 2, 1, 9, 11, 9, 8, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
3, 10, 1, 11, 10, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 10, 1, 0, 8, 10, 8, 11, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
3, 9, 0, 3, 11, 9, 11, 10, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 8, 10, 10, 8, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
4, 7, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
4, 3, 0, 7, 3, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 1, 9, 8, 4, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
4, 1, 9, 4, 7, 1, 7, 3, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 2, 10, 8, 4, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
3, 4, 7, 3, 0, 4, 1, 2, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 2, 10, 9, 0, 2, 8, 4, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, - 1, - 1, - 1, - 1,
8, 4, 7, 3, 11, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
11, 4, 7, 11, 2, 4, 2, 0, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 0, 1, 8, 4, 7, 2, 3, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, - 1, - 1, - 1, - 1,
3, 10, 1, 3, 11, 10, 7, 8, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, - 1, - 1, - 1, - 1,
4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, - 1, - 1, - 1, - 1,
4, 7, 11, 4, 11, 9, 9, 11, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 5, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 5, 4, 0, 8, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 5, 4, 1, 5, 0, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
8, 5, 4, 8, 3, 5, 3, 1, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 2, 10, 9, 5, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
3, 0, 8, 1, 2, 10, 4, 9, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
5, 2, 10, 5, 4, 2, 4, 0, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, - 1, - 1, - 1, - 1,
9, 5, 4, 2, 3, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 11, 2, 0, 8, 11, 4, 9, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 5, 4, 0, 1, 5, 2, 3, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, - 1, - 1, - 1, - 1,
10, 3, 11, 10, 1, 3, 9, 5, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, - 1, - 1, - 1, - 1,
5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, - 1, - 1, - 1, - 1,
5, 4, 8, 5, 8, 10, 10, 8, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 7, 8, 5, 7, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 3, 0, 9, 5, 3, 5, 7, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 7, 8, 0, 1, 7, 1, 5, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 5, 3, 3, 5, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 7, 8, 9, 5, 7, 10, 1, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, - 1, - 1, - 1, - 1,
8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, - 1, - 1, - 1, - 1,
2, 10, 5, 2, 5, 3, 3, 5, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
7, 9, 5, 7, 8, 9, 3, 11, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, - 1, - 1, - 1, - 1,
2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, - 1, - 1, - 1, - 1,
11, 2, 1, 11, 1, 7, 7, 1, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, - 1, - 1, - 1, - 1,
5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, - 1,
11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, - 1,
11, 10, 5, 7, 11, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
10, 6, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 8, 3, 5, 10, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 0, 1, 5, 10, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 8, 3, 1, 9, 8, 5, 10, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 6, 5, 2, 6, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 6, 5, 1, 2, 6, 3, 0, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 6, 5, 9, 0, 6, 0, 2, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, - 1, - 1, - 1, - 1,
2, 3, 11, 10, 6, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
11, 0, 8, 11, 2, 0, 10, 6, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 1, 9, 2, 3, 11, 5, 10, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, - 1, - 1, - 1, - 1,
6, 3, 11, 6, 5, 3, 5, 1, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, - 1, - 1, - 1, - 1,
3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, - 1, - 1, - 1, - 1,
6, 5, 9, 6, 9, 11, 11, 9, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
5, 10, 6, 4, 7, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
4, 3, 0, 4, 7, 3, 6, 5, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 9, 0, 5, 10, 6, 8, 4, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, - 1, - 1, - 1, - 1,
6, 1, 2, 6, 5, 1, 4, 7, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, - 1, - 1, - 1, - 1,
8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, - 1, - 1, - 1, - 1,
7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, - 1,
3, 11, 2, 7, 8, 4, 10, 6, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, - 1, - 1, - 1, - 1,
0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, - 1, - 1, - 1, - 1,
9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, - 1,
8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, - 1, - 1, - 1, - 1,
5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, - 1,
0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, - 1,
6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, - 1, - 1, - 1, - 1,
10, 4, 9, 6, 4, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
4, 10, 6, 4, 9, 10, 0, 8, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
10, 0, 1, 10, 6, 0, 6, 4, 0, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, - 1, - 1, - 1, - 1,
1, 4, 9, 1, 2, 4, 2, 6, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, - 1, - 1, - 1, - 1,
0, 2, 4, 4, 2, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
8, 3, 2, 8, 2, 4, 4, 2, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
10, 4, 9, 10, 6, 4, 11, 2, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, - 1, - 1, - 1, - 1,
3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, - 1, - 1, - 1, - 1,
6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, - 1,
9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, - 1, - 1, - 1, - 1,
8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, - 1,
3, 11, 6, 3, 6, 0, 0, 6, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
6, 4, 8, 11, 6, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
7, 10, 6, 7, 8, 10, 8, 9, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, - 1, - 1, - 1, - 1,
10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, - 1, - 1, - 1, - 1,
10, 6, 7, 10, 7, 1, 1, 7, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, - 1, - 1, - 1, - 1,
2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, - 1,
7, 8, 0, 7, 0, 6, 6, 0, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
7, 3, 2, 6, 7, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, - 1, - 1, - 1, - 1,
2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, - 1,
1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, - 1,
11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, - 1, - 1, - 1, - 1,
8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, - 1,
0, 9, 1, 11, 6, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, - 1, - 1, - 1, - 1,
7, 11, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
7, 6, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
3, 0, 8, 11, 7, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 1, 9, 11, 7, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
8, 1, 9, 8, 3, 1, 11, 7, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
10, 1, 2, 6, 11, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 2, 10, 3, 0, 8, 6, 11, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
2, 9, 0, 2, 10, 9, 6, 11, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, - 1, - 1, - 1, - 1,
7, 2, 3, 6, 2, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
7, 0, 8, 7, 6, 0, 6, 2, 0, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
2, 7, 6, 2, 3, 7, 0, 1, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, - 1, - 1, - 1, - 1,
10, 7, 6, 10, 1, 7, 1, 3, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, - 1, - 1, - 1, - 1,
0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, - 1, - 1, - 1, - 1,
7, 6, 10, 7, 10, 8, 8, 10, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
6, 8, 4, 11, 8, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
3, 6, 11, 3, 0, 6, 0, 4, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
8, 6, 11, 8, 4, 6, 9, 0, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, - 1, - 1, - 1, - 1,
6, 8, 4, 6, 11, 8, 2, 10, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, - 1, - 1, - 1, - 1,
4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, - 1, - 1, - 1, - 1,
10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, - 1,
8, 2, 3, 8, 4, 2, 4, 6, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 4, 2, 4, 6, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, - 1, - 1, - 1, - 1,
1, 9, 4, 1, 4, 2, 2, 4, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, - 1, - 1, - 1, - 1,
10, 1, 0, 10, 0, 6, 6, 0, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, - 1,
10, 9, 4, 6, 10, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
4, 9, 5, 7, 6, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 8, 3, 4, 9, 5, 11, 7, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
5, 0, 1, 5, 4, 0, 7, 6, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, - 1, - 1, - 1, - 1,
9, 5, 4, 10, 1, 2, 7, 6, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, - 1, - 1, - 1, - 1,
7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, - 1, - 1, - 1, - 1,
3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, - 1,
7, 2, 3, 7, 6, 2, 5, 4, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, - 1, - 1, - 1, - 1,
3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, - 1, - 1, - 1, - 1,
6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, - 1,
9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, - 1, - 1, - 1, - 1,
1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, - 1,
4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, - 1,
7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, - 1, - 1, - 1, - 1,
6, 9, 5, 6, 11, 9, 11, 8, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, - 1, - 1, - 1, - 1,
0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, - 1, - 1, - 1, - 1,
6, 11, 3, 6, 3, 5, 5, 3, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, - 1, - 1, - 1, - 1,
0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, - 1,
11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, - 1,
6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, - 1, - 1, - 1, - 1,
5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, - 1, - 1, - 1, - 1,
9, 5, 6, 9, 6, 0, 0, 6, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, - 1,
1, 5, 6, 2, 1, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, - 1,
10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, - 1, - 1, - 1, - 1,
0, 3, 8, 5, 6, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
10, 5, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
11, 5, 10, 7, 5, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
11, 5, 10, 11, 7, 5, 8, 3, 0, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
5, 11, 7, 5, 10, 11, 1, 9, 0, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, - 1, - 1, - 1, - 1,
11, 1, 2, 11, 7, 1, 7, 5, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, - 1, - 1, - 1, - 1,
9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, - 1, - 1, - 1, - 1,
7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, - 1,
2, 5, 10, 2, 3, 5, 3, 7, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, - 1, - 1, - 1, - 1,
9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, - 1, - 1, - 1, - 1,
9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, - 1,
1, 3, 5, 3, 7, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 8, 7, 0, 7, 1, 1, 7, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 0, 3, 9, 3, 5, 5, 3, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 8, 7, 5, 9, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
5, 8, 4, 5, 10, 8, 10, 11, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, - 1, - 1, - 1, - 1,
0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, - 1, - 1, - 1, - 1,
10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, - 1,
2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, - 1, - 1, - 1, - 1,
0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, - 1,
0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, - 1,
9, 4, 5, 2, 11, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, - 1, - 1, - 1, - 1,
5, 10, 2, 5, 2, 4, 4, 2, 0, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, - 1,
5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, - 1, - 1, - 1, - 1,
8, 4, 5, 8, 5, 3, 3, 5, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 4, 5, 1, 0, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, - 1, - 1, - 1, - 1,
9, 4, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
4, 11, 7, 4, 9, 11, 9, 10, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, - 1, - 1, - 1, - 1,
1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, - 1, - 1, - 1, - 1,
3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, - 1,
4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, - 1, - 1, - 1, - 1,
9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, - 1,
11, 7, 4, 11, 4, 2, 2, 4, 0, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, - 1, - 1, - 1, - 1,
2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, - 1, - 1, - 1, - 1,
9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, - 1,
3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, - 1,
1, 10, 2, 8, 7, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
4, 9, 1, 4, 1, 7, 7, 1, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, - 1, - 1, - 1, - 1,
4, 0, 3, 7, 4, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
4, 8, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 10, 8, 10, 11, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
3, 0, 9, 3, 9, 11, 11, 9, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 1, 10, 0, 10, 8, 8, 10, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
3, 1, 10, 11, 3, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 2, 11, 1, 11, 9, 9, 11, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, - 1, - 1, - 1, - 1,
0, 2, 11, 8, 0, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
3, 2, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
2, 3, 8, 2, 8, 10, 10, 8, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
9, 10, 2, 0, 9, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, - 1, - 1, - 1, - 1,
1, 10, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
1, 3, 8, 9, 1, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 9, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
0, 3, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
- 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1 ] );

/**
 * @author Slayvin / http://slayvin.net
 */

THREE.ShaderLib[ 'mirror' ] = {

	uniforms: {
		"mirrorColor": { value: new THREE.Color( 0x7F7F7F ) },
		"mirrorSampler": { value: null },
		"textureMatrix" : { value: new THREE.Matrix4() }
	},

	vertexShader: [

		"uniform mat4 textureMatrix;",

		"varying vec4 mirrorCoord;",

		"void main() {",

			"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
			"vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
			"mirrorCoord = textureMatrix * worldPosition;",

			"gl_Position = projectionMatrix * mvPosition;",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform vec3 mirrorColor;",
		"uniform sampler2D mirrorSampler;",

		"varying vec4 mirrorCoord;",

		"float blendOverlay(float base, float blend) {",
			"return( base < 0.5 ? ( 2.0 * base * blend ) : (1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );",
		"}",

		"void main() {",

			"vec4 color = texture2DProj(mirrorSampler, mirrorCoord);",
			"color = vec4(blendOverlay(mirrorColor.r, color.r), blendOverlay(mirrorColor.g, color.g), blendOverlay(mirrorColor.b, color.b), 1.0);",

			"gl_FragColor = color;",

		"}"

	].join( "\n" )

};

THREE.Mirror = function ( renderer, camera, options ) {

	THREE.Object3D.call( this );

	this.name = 'mirror_' + this.id;

	options = options || {};

	this.matrixNeedsUpdate = true;

	var width = options.textureWidth !== undefined ? options.textureWidth : 512;
	var height = options.textureHeight !== undefined ? options.textureHeight : 512;

	this.clipBias = options.clipBias !== undefined ? options.clipBias : 0.0;

	var mirrorColor = options.color !== undefined ? new THREE.Color( options.color ) : new THREE.Color( 0x7F7F7F );

	this.renderer = renderer;
	this.mirrorPlane = new THREE.Plane();
	this.normal = new THREE.Vector3( 0, 0, 1 );
	this.mirrorWorldPosition = new THREE.Vector3();
	this.cameraWorldPosition = new THREE.Vector3();
	this.rotationMatrix = new THREE.Matrix4();
	this.lookAtPosition = new THREE.Vector3( 0, 0, - 1 );
	this.clipPlane = new THREE.Vector4();

	// For debug only, show the normal and plane of the mirror
	var debugMode = options.debugMode !== undefined ? options.debugMode : false;

	if ( debugMode ) {

		var arrow = new THREE.ArrowHelper( new THREE.Vector3( 0, 0, 1 ), new THREE.Vector3( 0, 0, 0 ), 10, 0xffff80 );
		var planeGeometry = new THREE.Geometry();
		planeGeometry.vertices.push( new THREE.Vector3( - 10, - 10, 0 ) );
		planeGeometry.vertices.push( new THREE.Vector3( 10, - 10, 0 ) );
		planeGeometry.vertices.push( new THREE.Vector3( 10, 10, 0 ) );
		planeGeometry.vertices.push( new THREE.Vector3( - 10, 10, 0 ) );
		planeGeometry.vertices.push( planeGeometry.vertices[ 0 ] );
		var plane = new THREE.Line( planeGeometry, new THREE.LineBasicMaterial( { color: 0xffff80 } ) );

		this.add( arrow );
		this.add( plane );

	}

	if ( camera instanceof THREE.PerspectiveCamera ) {

		this.camera = camera;

	} else {

		this.camera = new THREE.PerspectiveCamera();
		console.log( this.name + ': camera is not a Perspective Camera!' );

	}

	this.textureMatrix = new THREE.Matrix4();

	this.mirrorCamera = this.camera.clone();
	this.mirrorCamera.matrixAutoUpdate = true;

	var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

	this.renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );
	this.renderTarget2 = new THREE.WebGLRenderTarget( width, height, parameters );

	var mirrorShader = THREE.ShaderLib[ "mirror" ];
	var mirrorUniforms = THREE.UniformsUtils.clone( mirrorShader.uniforms );

	this.material = new THREE.ShaderMaterial( {

		fragmentShader: mirrorShader.fragmentShader,
		vertexShader: mirrorShader.vertexShader,
		uniforms: mirrorUniforms

	} );

	this.material.uniforms.mirrorSampler.value = this.renderTarget.texture;
	this.material.uniforms.mirrorColor.value = mirrorColor;
	this.material.uniforms.textureMatrix.value = this.textureMatrix;

	if ( ! THREE.Math.isPowerOfTwo( width ) || ! THREE.Math.isPowerOfTwo( height ) ) {

		this.renderTarget.texture.generateMipmaps = false;
		this.renderTarget2.texture.generateMipmaps = false;

	}

	this.updateTextureMatrix();
	this.render();

};

THREE.Mirror.prototype = Object.create( THREE.Object3D.prototype );
THREE.Mirror.prototype.constructor = THREE.Mirror;

THREE.Mirror.prototype.renderWithMirror = function ( otherMirror ) {

	// update the mirror matrix to mirror the current view
	this.updateTextureMatrix();
	this.matrixNeedsUpdate = false;

	// set the camera of the other mirror so the mirrored view is the reference view
	var tempCamera = otherMirror.camera;
	otherMirror.camera = this.mirrorCamera;

	// render the other mirror in temp texture
	otherMirror.renderTemp();
	otherMirror.material.uniforms.mirrorSampler.value = otherMirror.renderTarget2.texture;

	// render the current mirror
	this.render();
	this.matrixNeedsUpdate = true;

	// restore material and camera of other mirror
	otherMirror.material.uniforms.mirrorSampler.value = otherMirror.renderTarget.texture;
	otherMirror.camera = tempCamera;

	// restore texture matrix of other mirror
	otherMirror.updateTextureMatrix();

};

THREE.Mirror.prototype.updateTextureMatrix = function () {

	this.updateMatrixWorld();
	this.camera.updateMatrixWorld();

	this.mirrorWorldPosition.setFromMatrixPosition( this.matrixWorld );
	this.cameraWorldPosition.setFromMatrixPosition( this.camera.matrixWorld );

	this.rotationMatrix.extractRotation( this.matrixWorld );

	this.normal.set( 0, 0, 1 );
	this.normal.applyMatrix4( this.rotationMatrix );

	var view = this.mirrorWorldPosition.clone().sub( this.cameraWorldPosition );
	view.reflect( this.normal ).negate();
	view.add( this.mirrorWorldPosition );

	this.rotationMatrix.extractRotation( this.camera.matrixWorld );

	this.lookAtPosition.set( 0, 0, - 1 );
	this.lookAtPosition.applyMatrix4( this.rotationMatrix );
	this.lookAtPosition.add( this.cameraWorldPosition );

	var target = this.mirrorWorldPosition.clone().sub( this.lookAtPosition );
	target.reflect( this.normal ).negate();
	target.add( this.mirrorWorldPosition );

	this.up.set( 0, - 1, 0 );
	this.up.applyMatrix4( this.rotationMatrix );
	this.up.reflect( this.normal ).negate();

	this.mirrorCamera.position.copy( view );
	this.mirrorCamera.up = this.up;
	this.mirrorCamera.lookAt( target );

	this.mirrorCamera.updateProjectionMatrix();
	this.mirrorCamera.updateMatrixWorld();
	this.mirrorCamera.matrixWorldInverse.getInverse( this.mirrorCamera.matrixWorld );

	// Update the texture matrix
	this.textureMatrix.set( 0.5, 0.0, 0.0, 0.5,
							0.0, 0.5, 0.0, 0.5,
							0.0, 0.0, 0.5, 0.5,
							0.0, 0.0, 0.0, 1.0 );
	this.textureMatrix.multiply( this.mirrorCamera.projectionMatrix );
	this.textureMatrix.multiply( this.mirrorCamera.matrixWorldInverse );

	// Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
	// Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
	this.mirrorPlane.setFromNormalAndCoplanarPoint( this.normal, this.mirrorWorldPosition );
	this.mirrorPlane.applyMatrix4( this.mirrorCamera.matrixWorldInverse );

	this.clipPlane.set( this.mirrorPlane.normal.x, this.mirrorPlane.normal.y, this.mirrorPlane.normal.z, this.mirrorPlane.constant );

	var q = new THREE.Vector4();
	var projectionMatrix = this.mirrorCamera.projectionMatrix;

	q.x = ( Math.sign( this.clipPlane.x ) + projectionMatrix.elements[ 8 ] ) / projectionMatrix.elements[ 0 ];
	q.y = ( Math.sign( this.clipPlane.y ) + projectionMatrix.elements[ 9 ] ) / projectionMatrix.elements[ 5 ];
	q.z = - 1.0;
	q.w = ( 1.0 + projectionMatrix.elements[ 10 ] ) / projectionMatrix.elements[ 14 ];

	// Calculate the scaled plane vector
	var c = new THREE.Vector4();
	c = this.clipPlane.multiplyScalar( 2.0 / this.clipPlane.dot( q ) );

	// Replacing the third row of the projection matrix
	projectionMatrix.elements[ 2 ] = c.x;
	projectionMatrix.elements[ 6 ] = c.y;
	projectionMatrix.elements[ 10 ] = c.z + 1.0 - this.clipBias;
	projectionMatrix.elements[ 14 ] = c.w;

};

THREE.Mirror.prototype.render = function () {

	if ( this.matrixNeedsUpdate ) this.updateTextureMatrix();

	this.matrixNeedsUpdate = true;

	// Render the mirrored view of the current scene into the target texture
	var scene = this;

	while ( scene.parent !== null ) {

		scene = scene.parent;

	}

	if ( scene !== undefined && scene instanceof THREE.Scene ) {

		// We can't render ourself to ourself
		var visible = this.material.visible;
		this.material.visible = false;

		this.renderer.render( scene, this.mirrorCamera, this.renderTarget, true );

		this.material.visible = visible;

	}

};

THREE.Mirror.prototype.renderTemp = function () {

	if ( this.matrixNeedsUpdate ) this.updateTextureMatrix();

	this.matrixNeedsUpdate = true;

	// Render the mirrored view of the current scene into the target texture
	var scene = this;

	while ( scene.parent !== null ) {

		scene = scene.parent;

	}

	if ( scene !== undefined && scene instanceof THREE.Scene ) {

		this.renderer.render( scene, this.mirrorCamera, this.renderTarget2, true );

	}

};

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.MorphAnimMesh = function ( geometry, material ) {

	THREE.Mesh.call( this, geometry, material );

	this.type = 'MorphAnimMesh';

	this.mixer = new THREE.AnimationMixer( this );
	this.activeAction = null;
};

THREE.MorphAnimMesh.prototype = Object.create( THREE.Mesh.prototype );
THREE.MorphAnimMesh.prototype.constructor = THREE.MorphAnimMesh;

THREE.MorphAnimMesh.prototype.setDirectionForward = function () {

	this.mixer.timeScale = 1.0;

};

THREE.MorphAnimMesh.prototype.setDirectionBackward = function () {

	this.mixer.timeScale = -1.0;

};

THREE.MorphAnimMesh.prototype.playAnimation = function ( label, fps ) {

	if( this.activeAction ) {

		this.activeAction.stop();
		this.activeAction = null;
		
	}

	var clip = THREE.AnimationClip.findByName( this, label );

	if ( clip ) {

		var action = this.mixer.clipAction( clip );
		action.timeScale = ( clip.tracks.length * fps ) / clip.duration;
		this.activeAction = action.play();

	} else {

		throw new Error( 'THREE.MorphAnimMesh: animations[' + label + '] undefined in .playAnimation()' );

	}

};

THREE.MorphAnimMesh.prototype.updateAnimation = function ( delta ) {

	this.mixer.update( delta );

};

THREE.MorphAnimMesh.prototype.copy = function ( source ) {

	THREE.Mesh.prototype.copy.call( this, source );

	this.mixer = new THREE.AnimationMixer( this );

	return this;

};

/**
 * @author mrdoob / http://mrdoob.com
 * @author willy-vvu / http://willy-vvu.github.io
 */

THREE.MorphAnimation = function ( mesh ) {

	this.mesh = mesh;
	this.frames = mesh.morphTargetInfluences.length;
	this.currentTime = 0;
	this.duration = 1000;
	this.loop = true;
	this.lastFrame = 0;
	this.currentFrame = 0;

	this.isPlaying = false;

};

THREE.MorphAnimation.prototype = {

	constructor: THREE.MorphAnimation,

	play: function () {

		this.isPlaying = true;

	},

	pause: function () {

		this.isPlaying = false;

	},

	update: function ( delta ) {

		if ( this.isPlaying === false ) return;

		this.currentTime += delta;

		if ( this.loop === true && this.currentTime > this.duration ) {

			this.currentTime %= this.duration;

		}

		this.currentTime = Math.min( this.currentTime, this.duration );

		var frameTime = this.duration / this.frames;
		var frame = Math.floor( this.currentTime / frameTime );

		var influences = this.mesh.morphTargetInfluences;

		if ( frame !== this.currentFrame ) {

			influences[ this.lastFrame ] = 0;
			influences[ this.currentFrame ] = 1;
			influences[ frame ] = 0;

			this.lastFrame = this.currentFrame;
			this.currentFrame = frame;

		}

		var mix = ( this.currentTime % frameTime ) / frameTime;

		influences[ frame ] = mix;
		influences[ this.lastFrame ] = 1 - mix;

	}

};

THREE.Ocean = function ( renderer, camera, scene, options ) {

	// flag used to trigger parameter changes
	this.changed = true;
	this.initial = true;

	// Assign required parameters as object properties
	this.oceanCamera = new THREE.OrthographicCamera(); //camera.clone();
	this.oceanCamera.position.z = 1;
	this.renderer = renderer;
	this.renderer.clearColor( 0xffffff );

	this.scene = new THREE.Scene();

	// Assign optional parameters as variables and object properties
	function optionalParameter( value, defaultValue ) {

		return value !== undefined ? value : defaultValue;

	}
	options = options || {};
	this.clearColor = optionalParameter( options.CLEAR_COLOR, [ 1.0, 1.0, 1.0, 0.0 ] );
	this.geometryOrigin = optionalParameter( options.GEOMETRY_ORIGIN, [ - 1000.0, - 1000.0 ] );
	this.sunDirectionX = optionalParameter( options.SUN_DIRECTION[ 0 ], - 1.0 );
	this.sunDirectionY = optionalParameter( options.SUN_DIRECTION[ 1 ], 1.0 );
	this.sunDirectionZ = optionalParameter( options.SUN_DIRECTION[ 2 ], 1.0 );
	this.oceanColor = optionalParameter( options.OCEAN_COLOR, new THREE.Vector3( 0.004, 0.016, 0.047 ) );
	this.skyColor = optionalParameter( options.SKY_COLOR, new THREE.Vector3( 3.2, 9.6, 12.8 ) );
	this.exposure = optionalParameter( options.EXPOSURE, 0.35 );
	this.geometryResolution = optionalParameter( options.GEOMETRY_RESOLUTION, 32 );
	this.geometrySize = optionalParameter( options.GEOMETRY_SIZE, 2000 );
	this.resolution = optionalParameter( options.RESOLUTION, 64 );
	this.floatSize = optionalParameter( options.SIZE_OF_FLOAT, 4 );
	this.windX = optionalParameter( options.INITIAL_WIND[ 0 ], 10.0 ),
	this.windY = optionalParameter( options.INITIAL_WIND[ 1 ], 10.0 ),
	this.size = optionalParameter( options.INITIAL_SIZE, 250.0 ),
	this.choppiness = optionalParameter( options.INITIAL_CHOPPINESS, 1.5 );

	//
	this.matrixNeedsUpdate = false;

	// Setup framebuffer pipeline
	var renderTargetType = optionalParameter( options.USE_HALF_FLOAT, false ) ? THREE.HalfFloatType : THREE.FloatType;
	var LinearClampParams = {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		wrapS: THREE.ClampToEdgeWrapping,
		wrapT: THREE.ClampToEdgeWrapping,
		format: THREE.RGBAFormat,
		stencilBuffer: false,
		depthBuffer: false,
		premultiplyAlpha: false,
		type: renderTargetType
	};
	var NearestClampParams = {
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		wrapS: THREE.ClampToEdgeWrapping,
		wrapT: THREE.ClampToEdgeWrapping,
		format: THREE.RGBAFormat,
		stencilBuffer: false,
		depthBuffer: false,
		premultiplyAlpha: false,
		type: renderTargetType
	};
	var NearestRepeatParams = {
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		wrapS: THREE.RepeatWrapping,
		wrapT: THREE.RepeatWrapping,
		format: THREE.RGBAFormat,
		stencilBuffer: false,
		depthBuffer: false,
		premultiplyAlpha: false,
		type: renderTargetType
	};
	this.initialSpectrumFramebuffer = new THREE.WebGLRenderTarget( this.resolution, this.resolution, NearestRepeatParams );
	this.spectrumFramebuffer = new THREE.WebGLRenderTarget( this.resolution, this.resolution, NearestClampParams );
	this.pingPhaseFramebuffer = new THREE.WebGLRenderTarget( this.resolution, this.resolution, NearestClampParams );
	this.pongPhaseFramebuffer = new THREE.WebGLRenderTarget( this.resolution, this.resolution, NearestClampParams );
	this.pingTransformFramebuffer = new THREE.WebGLRenderTarget( this.resolution, this.resolution, NearestClampParams );
	this.pongTransformFramebuffer = new THREE.WebGLRenderTarget( this.resolution, this.resolution, NearestClampParams );
	this.displacementMapFramebuffer = new THREE.WebGLRenderTarget( this.resolution, this.resolution, LinearClampParams );
	this.normalMapFramebuffer = new THREE.WebGLRenderTarget( this.resolution, this.resolution, LinearClampParams );

	// Define shaders and constant uniforms
	////////////////////////////////////////

	// 0 - The vertex shader used in all of the simulation steps
	var fullscreeenVertexShader = THREE.ShaderLib[ "ocean_sim_vertex" ];

	// 1 - Horizontal wave vertices used for FFT
	var oceanHorizontalShader = THREE.ShaderLib[ "ocean_subtransform" ];
	var oceanHorizontalUniforms = THREE.UniformsUtils.clone( oceanHorizontalShader.uniforms );
	this.materialOceanHorizontal = new THREE.ShaderMaterial( {
		uniforms: oceanHorizontalUniforms,
		vertexShader: fullscreeenVertexShader.vertexShader,
		fragmentShader: "#define HORIZONTAL \n" + oceanHorizontalShader.fragmentShader
	} );
	this.materialOceanHorizontal.uniforms.u_transformSize = { value: this.resolution };
	this.materialOceanHorizontal.uniforms.u_subtransformSize = { value: null };
	this.materialOceanHorizontal.uniforms.u_input = { value: null };
	this.materialOceanHorizontal.depthTest = false;

	// 2 - Vertical wave vertices used for FFT
	var oceanVerticalShader = THREE.ShaderLib[ "ocean_subtransform" ];
	var oceanVerticalUniforms = THREE.UniformsUtils.clone( oceanVerticalShader.uniforms );
	this.materialOceanVertical = new THREE.ShaderMaterial( {
		uniforms: oceanVerticalUniforms,
		vertexShader: fullscreeenVertexShader.vertexShader,
		fragmentShader: oceanVerticalShader.fragmentShader
	} );
	this.materialOceanVertical.uniforms.u_transformSize = { value: this.resolution };
	this.materialOceanVertical.uniforms.u_subtransformSize = { value: null };
	this.materialOceanVertical.uniforms.u_input = { value: null };
	this.materialOceanVertical.depthTest = false;

	// 3 - Initial spectrum used to generate height map
	var initialSpectrumShader = THREE.ShaderLib[ "ocean_initial_spectrum" ];
	var initialSpectrumUniforms = THREE.UniformsUtils.clone( initialSpectrumShader.uniforms );
	this.materialInitialSpectrum = new THREE.ShaderMaterial( {
		uniforms: initialSpectrumUniforms,
		vertexShader: fullscreeenVertexShader.vertexShader,
		fragmentShader: initialSpectrumShader.fragmentShader
	} );
	this.materialInitialSpectrum.uniforms.u_wind = { value: new THREE.Vector2() };
	this.materialInitialSpectrum.uniforms.u_resolution = { value: this.resolution };
	this.materialInitialSpectrum.depthTest = false;

	// 4 - Phases used to animate heightmap
	var phaseShader = THREE.ShaderLib[ "ocean_phase" ];
	var phaseUniforms = THREE.UniformsUtils.clone( phaseShader.uniforms );
	this.materialPhase = new THREE.ShaderMaterial( {
		uniforms: phaseUniforms,
		vertexShader: fullscreeenVertexShader.vertexShader,
		fragmentShader: phaseShader.fragmentShader
	} );
	this.materialPhase.uniforms.u_resolution = { value: this.resolution };
	this.materialPhase.depthTest = false;

	// 5 - Shader used to update spectrum
	var spectrumShader = THREE.ShaderLib[ "ocean_spectrum" ];
	var spectrumUniforms = THREE.UniformsUtils.clone( spectrumShader.uniforms );
	this.materialSpectrum = new THREE.ShaderMaterial( {
		uniforms: spectrumUniforms,
		vertexShader: fullscreeenVertexShader.vertexShader,
		fragmentShader: spectrumShader.fragmentShader
	} );
	this.materialSpectrum.uniforms.u_initialSpectrum = { value: null };
	this.materialSpectrum.uniforms.u_resolution = { value: this.resolution };
	this.materialSpectrum.depthTest = false;

	// 6 - Shader used to update spectrum normals
	var normalShader = THREE.ShaderLib[ "ocean_normals" ];
	var normalUniforms = THREE.UniformsUtils.clone( normalShader.uniforms );
	this.materialNormal = new THREE.ShaderMaterial( {
		uniforms: normalUniforms,
		vertexShader: fullscreeenVertexShader.vertexShader,
		fragmentShader: normalShader.fragmentShader
	} );
	this.materialNormal.uniforms.u_displacementMap = { value: null };
	this.materialNormal.uniforms.u_resolution = { value: this.resolution };
	this.materialNormal.depthTest = false;

	// 7 - Shader used to update normals
	var oceanShader = THREE.ShaderLib[ "ocean_main" ];
	var oceanUniforms = THREE.UniformsUtils.clone( oceanShader.uniforms );
	this.materialOcean = new THREE.ShaderMaterial( {
		uniforms: oceanUniforms,
		vertexShader: oceanShader.vertexShader,
		fragmentShader: oceanShader.fragmentShader
	} );
	// this.materialOcean.wireframe = true;
	this.materialOcean.uniforms.u_geometrySize = { value: this.resolution };
	this.materialOcean.uniforms.u_displacementMap = { value: this.displacementMapFramebuffer.texture };
	this.materialOcean.uniforms.u_normalMap = { value: this.normalMapFramebuffer.texture };
	this.materialOcean.uniforms.u_oceanColor = { value: this.oceanColor };
	this.materialOcean.uniforms.u_skyColor = { value: this.skyColor };
	this.materialOcean.uniforms.u_sunDirection = { value: new THREE.Vector3( this.sunDirectionX, this.sunDirectionY, this.sunDirectionZ ) };
	this.materialOcean.uniforms.u_exposure = { value: this.exposure };

	// Disable blending to prevent default premultiplied alpha values
	this.materialOceanHorizontal.blending = 0;
	this.materialOceanVertical.blending = 0;
	this.materialInitialSpectrum.blending = 0;
	this.materialPhase.blending = 0;
	this.materialSpectrum.blending = 0;
	this.materialNormal.blending = 0;
	this.materialOcean.blending = 0;

	// Create the simulation plane
	this.screenQuad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ) );
	this.scene.add( this.screenQuad );

	// Initialise spectrum data
	this.generateSeedPhaseTexture();

	// Generate the ocean mesh
	this.generateMesh();

};

THREE.Ocean.prototype.generateMesh = function () {

	var geometry = new THREE.PlaneBufferGeometry( this.geometrySize, this.geometrySize, this.geometryResolution, this.geometryResolution );

	geometry.rotateX( - Math.PI / 2 );

	this.oceanMesh = new THREE.Mesh( geometry, this.materialOcean );

};

THREE.Ocean.prototype.render = function () {

	this.scene.overrideMaterial = null;

	if ( this.changed )
		this.renderInitialSpectrum();

	this.renderWavePhase();
	this.renderSpectrum();
	this.renderSpectrumFFT();
	this.renderNormalMap();
	this.scene.overrideMaterial = null;

};

THREE.Ocean.prototype.generateSeedPhaseTexture = function() {

	// Setup the seed texture
	this.pingPhase = true;
	var phaseArray = new window.Float32Array( this.resolution * this.resolution * 4 );
	for ( var i = 0; i < this.resolution; i ++ ) {

		for ( var j = 0; j < this.resolution; j ++ ) {

			phaseArray[ i * this.resolution * 4 + j * 4 ] =  Math.random() * 2.0 * Math.PI;
			phaseArray[ i * this.resolution * 4 + j * 4 + 1 ] = 0.0;
			phaseArray[ i * this.resolution * 4 + j * 4 + 2 ] = 0.0;
			phaseArray[ i * this.resolution * 4 + j * 4 + 3 ] = 0.0;

		}

	}

	this.pingPhaseTexture = new THREE.DataTexture( phaseArray, this.resolution, this.resolution, THREE.RGBAFormat );
	this.pingPhaseTexture.wrapS = THREE.ClampToEdgeWrapping;
	this.pingPhaseTexture.wrapT = THREE.ClampToEdgeWrapping;
	this.pingPhaseTexture.type = THREE.FloatType;
	this.pingPhaseTexture.needsUpdate = true;

};

THREE.Ocean.prototype.renderInitialSpectrum = function () {

	this.scene.overrideMaterial = this.materialInitialSpectrum;
	this.materialInitialSpectrum.uniforms.u_wind.value.set( this.windX, this.windY );
	this.materialInitialSpectrum.uniforms.u_size.value = this.size;
	this.renderer.render( this.scene, this.oceanCamera, this.initialSpectrumFramebuffer, true );

};

THREE.Ocean.prototype.renderWavePhase = function () {

	this.scene.overrideMaterial = this.materialPhase;
	this.screenQuad.material = this.materialPhase;
	if ( this.initial ) {

		this.materialPhase.uniforms.u_phases.value = this.pingPhaseTexture;
		this.initial = false;

	}else {

		this.materialPhase.uniforms.u_phases.value = this.pingPhase ? this.pingPhaseFramebuffer.texture : this.pongPhaseFramebuffer.texture;

	}
	this.materialPhase.uniforms.u_deltaTime.value = this.deltaTime;
	this.materialPhase.uniforms.u_size.value = this.size;
	this.renderer.render( this.scene, this.oceanCamera, this.pingPhase ? this.pongPhaseFramebuffer : this.pingPhaseFramebuffer );
	this.pingPhase = ! this.pingPhase;

};

THREE.Ocean.prototype.renderSpectrum = function () {

	this.scene.overrideMaterial = this.materialSpectrum;
	this.materialSpectrum.uniforms.u_initialSpectrum.value = this.initialSpectrumFramebuffer.texture;
	this.materialSpectrum.uniforms.u_phases.value = this.pingPhase ? this.pingPhaseFramebuffer.texture : this.pongPhaseFramebuffer.texture;
	this.materialSpectrum.uniforms.u_choppiness.value = this.choppiness;
	this.materialSpectrum.uniforms.u_size.value = this.size;
	this.renderer.render( this.scene, this.oceanCamera, this.spectrumFramebuffer );

};

THREE.Ocean.prototype.renderSpectrumFFT = function() {

	// GPU FFT using Stockham formulation
	var iterations = Math.log( this.resolution ) / Math.log( 2 ); // log2

	this.scene.overrideMaterial = this.materialOceanHorizontal;

	for ( var i = 0; i < iterations; i ++ ) {

		if ( i === 0 ) {

			this.materialOceanHorizontal.uniforms.u_input.value = this.spectrumFramebuffer.texture;
			this.materialOceanHorizontal.uniforms.u_subtransformSize.value = Math.pow( 2, ( i % ( iterations ) ) + 1 );
			this.renderer.render( this.scene, this.oceanCamera, this.pingTransformFramebuffer );

		} else if ( i % 2 === 1 ) {

			this.materialOceanHorizontal.uniforms.u_input.value = this.pingTransformFramebuffer.texture;
			this.materialOceanHorizontal.uniforms.u_subtransformSize.value = Math.pow( 2, ( i % ( iterations ) ) + 1 );
			this.renderer.render( this.scene, this.oceanCamera, this.pongTransformFramebuffer );

		} else {

			this.materialOceanHorizontal.uniforms.u_input.value = this.pongTransformFramebuffer.texture;
			this.materialOceanHorizontal.uniforms.u_subtransformSize.value = Math.pow( 2, ( i % ( iterations ) ) + 1 );
			this.renderer.render( this.scene, this.oceanCamera, this.pingTransformFramebuffer );

		}

	}
	this.scene.overrideMaterial = this.materialOceanVertical;
	for ( var i = iterations; i < iterations * 2; i ++ ) {

		if ( i === iterations * 2 - 1 ) {

			this.materialOceanVertical.uniforms.u_input.value = ( iterations % 2 === 0 ) ? this.pingTransformFramebuffer.texture : this.pongTransformFramebuffer.texture;
			this.materialOceanVertical.uniforms.u_subtransformSize.value = Math.pow( 2, ( i % ( iterations ) ) + 1 );
			this.renderer.render( this.scene, this.oceanCamera, this.displacementMapFramebuffer );

		} else if ( i % 2 === 1 ) {

			this.materialOceanVertical.uniforms.u_input.value = this.pingTransformFramebuffer.texture;
			this.materialOceanVertical.uniforms.u_subtransformSize.value = Math.pow( 2, ( i % ( iterations ) ) + 1 );
			this.renderer.render( this.scene, this.oceanCamera, this.pongTransformFramebuffer );

		} else {

			this.materialOceanVertical.uniforms.u_input.value = this.pongTransformFramebuffer.texture;
			this.materialOceanVertical.uniforms.u_subtransformSize.value = Math.pow( 2, ( i % ( iterations ) ) + 1 );
			this.renderer.render( this.scene, this.oceanCamera, this.pingTransformFramebuffer );

		}

	}

};

THREE.Ocean.prototype.renderNormalMap = function () {

	this.scene.overrideMaterial = this.materialNormal;
	if ( this.changed ) this.materialNormal.uniforms.u_size.value = this.size;
	this.materialNormal.uniforms.u_displacementMap.value = this.displacementMapFramebuffer.texture;
	this.renderer.render( this.scene, this.oceanCamera, this.normalMapFramebuffer, true );

};

/*!
 *
 * threeoctree.js (r60) / https://github.com/collinhover/threeoctree
 * (sparse) dynamic 3D spatial representation structure for fast searches.
 *
 * @author Collin Hover / http://collinhover.com/
 * based on Dynamic Octree by Piko3D @ http://www.piko3d.com/ and Octree by Marek Pawlowski @ pawlowski.it
 *
 */
 ( function ( THREE ) {

	"use strict";
	
	/*===================================================

	utility

	=====================================================*/
	
	function isNumber ( n ) {

		return ! isNaN( n ) && isFinite( n );

	}
	
	function isArray ( target ) {

		return Object.prototype.toString.call( target ) === '[object Array]';

	}
	
	function toArray ( target ) {

		return target ? ( isArray ( target ) !== true ? [ target ] : target ) : [];

	}
	
	function indexOfValue( array, value ) {
		
		for ( var i = 0, il = array.length; i < il; i ++ ) {
			
			if ( array[ i ] === value ) {
				
				return i;
				
			}
			
		}
		
		return - 1;
		
	}
	
	function indexOfPropertyWithValue( array, property, value ) {
		
		for ( var i = 0, il = array.length; i < il; i ++ ) {
			
			if ( array[ i ][ property ] === value ) {
				
				return i;
				
			}
			
		}
		
		return - 1;
		
	}

	/*===================================================

	octree

	=====================================================*/

	THREE.Octree = function ( parameters ) {
		
		// handle parameters
		
		parameters = parameters || {};
		
		parameters.tree = this;
		
		// static properties ( modification is not recommended )
		
		this.nodeCount = 0;
		
		this.INDEX_INSIDE_CROSS = - 1;
		this.INDEX_OUTSIDE_OFFSET = 2;
		
		this.INDEX_OUTSIDE_POS_X = isNumber( parameters.INDEX_OUTSIDE_POS_X ) ? parameters.INDEX_OUTSIDE_POS_X : 0;
		this.INDEX_OUTSIDE_NEG_X = isNumber( parameters.INDEX_OUTSIDE_NEG_X ) ? parameters.INDEX_OUTSIDE_NEG_X : 1;
		this.INDEX_OUTSIDE_POS_Y = isNumber( parameters.INDEX_OUTSIDE_POS_Y ) ? parameters.INDEX_OUTSIDE_POS_Y : 2;
		this.INDEX_OUTSIDE_NEG_Y = isNumber( parameters.INDEX_OUTSIDE_NEG_Y ) ? parameters.INDEX_OUTSIDE_NEG_Y : 3;
		this.INDEX_OUTSIDE_POS_Z = isNumber( parameters.INDEX_OUTSIDE_POS_Z ) ? parameters.INDEX_OUTSIDE_POS_Z : 4;
		this.INDEX_OUTSIDE_NEG_Z = isNumber( parameters.INDEX_OUTSIDE_NEG_Z ) ? parameters.INDEX_OUTSIDE_NEG_Z : 5;
		
		this.INDEX_OUTSIDE_MAP = [];
		this.INDEX_OUTSIDE_MAP[ this.INDEX_OUTSIDE_POS_X ] = { index: this.INDEX_OUTSIDE_POS_X, count: 0, x: 1, y: 0, z: 0 };
		this.INDEX_OUTSIDE_MAP[ this.INDEX_OUTSIDE_NEG_X ] = { index: this.INDEX_OUTSIDE_NEG_X, count: 0, x: - 1, y: 0, z: 0 };
		this.INDEX_OUTSIDE_MAP[ this.INDEX_OUTSIDE_POS_Y ] = { index: this.INDEX_OUTSIDE_POS_Y, count: 0, x: 0, y: 1, z: 0 };
		this.INDEX_OUTSIDE_MAP[ this.INDEX_OUTSIDE_NEG_Y ] = { index: this.INDEX_OUTSIDE_NEG_Y, count: 0, x: 0, y: - 1, z: 0 };
		this.INDEX_OUTSIDE_MAP[ this.INDEX_OUTSIDE_POS_Z ] = { index: this.INDEX_OUTSIDE_POS_Z, count: 0, x: 0, y: 0, z: 1 };
		this.INDEX_OUTSIDE_MAP[ this.INDEX_OUTSIDE_NEG_Z ] = { index: this.INDEX_OUTSIDE_NEG_Z, count: 0, x: 0, y: 0, z: - 1 };
		
		this.FLAG_POS_X = 1 << ( this.INDEX_OUTSIDE_POS_X + 1 );
		this.FLAG_NEG_X = 1 << ( this.INDEX_OUTSIDE_NEG_X + 1 );
		this.FLAG_POS_Y = 1 << ( this.INDEX_OUTSIDE_POS_Y + 1 );
		this.FLAG_NEG_Y = 1 << ( this.INDEX_OUTSIDE_NEG_Y + 1 );
		this.FLAG_POS_Z = 1 << ( this.INDEX_OUTSIDE_POS_Z + 1 );
		this.FLAG_NEG_Z = 1 << ( this.INDEX_OUTSIDE_NEG_Z + 1 );
		
		this.utilVec31Search = new THREE.Vector3();
		this.utilVec32Search = new THREE.Vector3();
		
		// pass scene to see octree structure
		
		this.scene = parameters.scene;
		
		if ( this.scene ) {
			
			this.visualGeometry = new THREE.BoxGeometry( 1, 1, 1 );
			this.visualMaterial = new THREE.MeshBasicMaterial( { color: 0xFF0066, wireframe: true, wireframeLinewidth: 1 } );
			
		}
		
		// properties
		
		this.objects = [];
		this.objectsMap = {};
		this.objectsData = [];
		this.objectsDeferred = [];
		
		this.depthMax = isNumber( parameters.depthMax ) ? parameters.depthMax : Infinity;
		this.objectsThreshold = isNumber( parameters.objectsThreshold ) ? parameters.objectsThreshold : 8;
		this.overlapPct = isNumber( parameters.overlapPct ) ? parameters.overlapPct : 0.15;
		this.undeferred = parameters.undeferred || false;
		
		this.root = parameters.root instanceof THREE.OctreeNode ? parameters.root : new THREE.OctreeNode( parameters );
		
	};

	THREE.Octree.prototype = {
		
		update: function () {
			
			// add any deferred objects that were waiting for render cycle
			
			if ( this.objectsDeferred.length > 0 ) {
				
				for ( var i = 0, il = this.objectsDeferred.length; i < il; i ++ ) {
					
					var deferred = this.objectsDeferred[ i ];
					
					this.addDeferred( deferred.object, deferred.options );
					
				}
				
				this.objectsDeferred.length = 0;
				
			}
			
		},
		
		add: function ( object, options ) {
			
			// add immediately
			
			if ( this.undeferred ) {
				
				this.updateObject( object );
				
				this.addDeferred( object, options );
				
			} else {
				
				// defer add until update called
				
				this.objectsDeferred.push( { object: object, options: options } );
				
			}
			
		},
		
		addDeferred: function ( object, options ) {
			
			var i, l,
				geometry,
				faces,
				useFaces,
				vertices,
				useVertices,
				objectData;
			
			// ensure object is not object data
			
			if ( object instanceof THREE.OctreeObjectData ) {
				
				object = object.object;
				
			}
			
			// check uuid to avoid duplicates
			
			if ( ! object.uuid ) {
				
				object.uuid = THREE.Math.generateUUID();
				
			}
			
			if ( ! this.objectsMap[ object.uuid ] ) {
				
				// store
				
				this.objects.push( object );
				this.objectsMap[ object.uuid ] = object;
				
				// check options
				
				if ( options ) {
					
					useFaces = options.useFaces;
					useVertices = options.useVertices;
					
				}
				
				if ( useVertices === true ) {
					
					geometry = object.geometry;
					vertices = geometry.vertices;
					
					for ( i = 0, l = vertices.length; i < l; i ++ ) {
						
						this.addObjectData( object, vertices[ i ] );
						
					}
					
				} else if ( useFaces === true ) {
					
					geometry = object.geometry;
					faces = geometry.faces;
					
					for ( i = 0, l = faces.length; i < l; i ++ ) {
						
						this.addObjectData( object, faces[ i ] );
						
					}
					
				} else {
					
					this.addObjectData( object );
					
				}
				
			}
			
		},
		
		addObjectData: function ( object, part ) {
			
			var objectData = new THREE.OctreeObjectData( object, part );
			
			// add to tree objects data list
			
			this.objectsData.push( objectData );
			
			// add to nodes
			
			this.root.addObject( objectData );
			
		},
		
		remove: function ( object ) {
			
			var i, l,
				objectData = object,
				index,
				objectsDataRemoved;
			
			// ensure object is not object data for index search
			
			if ( object instanceof THREE.OctreeObjectData ) {
				
				object = object.object;
				
			}
			
			// check uuid
			
			if ( this.objectsMap[ object.uuid ] ) {
				
				this.objectsMap[ object.uuid ] = undefined;
				
				// check and remove from objects, nodes, and data lists
				
				index = indexOfValue( this.objects, object );
				
				if ( index !== - 1 ) {
					
					this.objects.splice( index, 1 );
					
					// remove from nodes
					
					objectsDataRemoved = this.root.removeObject( objectData );
					
					// remove from objects data list
					
					for ( i = 0, l = objectsDataRemoved.length; i < l; i ++ ) {
						
						objectData = objectsDataRemoved[ i ];
						
						index = indexOfValue( this.objectsData, objectData );
						
						if ( index !== - 1 ) {
							
							this.objectsData.splice( index, 1 );
							
						}
						
					}
					
				}
				
			} else if ( this.objectsDeferred.length > 0 ) {
				
				// check and remove from deferred
				
				index = indexOfPropertyWithValue( this.objectsDeferred, 'object', object );
				
				if ( index !== - 1 ) {
					
					this.objectsDeferred.splice( index, 1 );
					
				}
				
			}
			
		},
		
		extend: function ( octree ) {
			
			var i, l,
				objectsData,
				objectData;
				
			if ( octree instanceof THREE.Octree ) {
				
				// for each object data
				
				objectsData = octree.objectsData;
				
				for ( i = 0, l = objectsData.length; i < l; i ++ ) {
					
					objectData = objectsData[ i ];
					
					this.add( objectData, { useFaces: objectData.faces, useVertices: objectData.vertices } );
					
				}
				
			}
			
		},
		
		rebuild: function () {
			
			var i, l,
				node,
				object,
				objectData,
				indexOctant,
				indexOctantLast,
				objectsUpdate = [];
			
			// check all object data for changes in position
			// assumes all object matrices are up to date
			
			for ( i = 0, l = this.objectsData.length; i < l; i ++ ) {
				
				objectData = this.objectsData[ i ];
				
				node = objectData.node;
				
				// update object
				
				objectData.update();
				
				// if position has changed since last organization of object in tree
				
				if ( node instanceof THREE.OctreeNode && ! objectData.positionLast.equals( objectData.position ) ) {
					
					// get octant index of object within current node
					
					indexOctantLast = objectData.indexOctant;
					
					indexOctant = node.getOctantIndex( objectData );
					
					// if object octant index has changed
					
					if ( indexOctant !== indexOctantLast ) {
						
						// add to update list
						
						objectsUpdate.push( objectData );
						
					}
					
				}
				
			}
			
			// update changed objects
			
			for ( i = 0, l = objectsUpdate.length; i < l; i ++ ) {
				
				objectData = objectsUpdate[ i ];
				
				// remove object from current node
				
				objectData.node.removeObject( objectData );
				
				// add object to tree root
				
				this.root.addObject( objectData );
				
			}
			
		},
		
		updateObject: function ( object ) {
			
			var i, l,
				parentCascade = [ object ],
				parent,
				parentUpdate;
			
			// search all parents between object and root for world matrix update
			
			parent = object.parent;
			
			while ( parent ) {
				
				parentCascade.push( parent );
				parent = parent.parent;
				
			}
			
			for ( i = 0, l = parentCascade.length; i < l; i ++ ) {
				
				parent = parentCascade[ i ];
				
				if ( parent.matrixWorldNeedsUpdate === true ) {
					
					parentUpdate = parent;
					
				}
				
			}
			
			// update world matrix starting at uppermost parent that needs update
			
			if ( typeof parentUpdate !== 'undefined' ) {
				
				parentUpdate.updateMatrixWorld();
				
			}
			
		},
		
		search: function ( position, radius, organizeByObject, direction ) {
			
			var i, l,
				node,
				objects,
				objectData,
				object,
				results,
				resultData,
				resultsObjectsIndices,
				resultObjectIndex,
				directionPct;
			
			// add root objects
			
			objects = [].concat( this.root.objects );
			
			// ensure radius (i.e. distance of ray) is a number
			
			if ( ! ( radius > 0 ) ) {
				
				radius = Number.MAX_VALUE;
				
			}
			
			// if direction passed, normalize and find pct
			
			if ( direction instanceof THREE.Vector3 ) {
				
				direction = this.utilVec31Search.copy( direction ).normalize();
				directionPct = this.utilVec32Search.set( 1, 1, 1 ).divide( direction );
				
			}
			
			// search each node of root
			
			for ( i = 0, l = this.root.nodesIndices.length; i < l; i ++ ) {
				
				node = this.root.nodesByIndex[ this.root.nodesIndices[ i ] ];
				
				objects = node.search( position, radius, objects, direction, directionPct );
				
			}
			
			// if should organize results by object
			
			if ( organizeByObject === true ) {
				
				results = [];
				resultsObjectsIndices = [];
				
				// for each object data found
				
				for ( i = 0, l = objects.length; i < l; i ++ ) {
					
					objectData = objects[ i ];
					object = objectData.object;
					
					resultObjectIndex = indexOfValue( resultsObjectsIndices, object );
					
					// if needed, create new result data
					
					if ( resultObjectIndex === - 1 ) {
						
						resultData = {
							object: object,
							faces: [],
							vertices: []
						};
						
						results.push( resultData );
						
						resultsObjectsIndices.push( object );
						
					} else {
						
						resultData = results[ resultObjectIndex ];
						
					}
					
					// object data has faces or vertices, add to list
					
					if ( objectData.faces ) {
						
						resultData.faces.push( objectData.faces );
						
					} else if ( objectData.vertices ) {
						
						resultData.vertices.push( objectData.vertices );
						
					}
					
				}
				
			} else {
				
				results = objects;
				
			}
			
			return results;
			
		},
		
		setRoot: function ( root ) { 
			
			if ( root instanceof THREE.OctreeNode ) {
				
				// store new root
				
				this.root = root;
				
				// update properties
				
				this.root.updateProperties();
				
			}
			
		},
		
		getDepthEnd: function () {
			
			return this.root.getDepthEnd();
			
		},
		
		getNodeCountEnd: function () {
			
			return this.root.getNodeCountEnd();
			
		},
		
		getObjectCountEnd: function () {
			
			return this.root.getObjectCountEnd();
			
		},
		
		toConsole: function () {
			
			this.root.toConsole();
			
		}
		
	};

	/*===================================================

	object data

	=====================================================*/

	THREE.OctreeObjectData = function ( object, part ) {
		
		// properties
		
		this.object = object;
		
		// handle part by type
		
		if ( part instanceof THREE.Face3 ) {
			
			this.faces = part;
			this.face3 = true;
			this.utilVec31FaceBounds = new THREE.Vector3();
			
		} else if ( part instanceof THREE.Vector3 ) {
			
			this.vertices = part;
			
		}
		
		this.radius = 0;
		this.position = new THREE.Vector3();
			
		// initial update
		
		if ( this.object instanceof THREE.Object3D ) {
			
			this.update();
			
		}
		
		this.positionLast = this.position.clone();
		
	};

	THREE.OctreeObjectData.prototype = {
		
		update: function () {
			
			if ( this.face3 ) {
				
				this.radius = this.getFace3BoundingRadius( this.object, this.faces );
				this.position.copy( this.faces.centroid ).applyMatrix4( this.object.matrixWorld );
				
			} else if ( this.vertices ) {
				
				this.radius = this.object.material.size || 1;
				this.position.copy( this.vertices ).applyMatrix4( this.object.matrixWorld );
				
			} else {
				
				if ( this.object.geometry ) {
					
					if ( this.object.geometry.boundingSphere === null ) {
						
						this.object.geometry.computeBoundingSphere();
						
					}
					
					this.radius = this.object.geometry.boundingSphere.radius;
					this.position.copy( this.object.geometry.boundingSphere.center ).applyMatrix4( this.object.matrixWorld );
					
				} else {
					
					this.radius = this.object.boundRadius;
					this.position.setFromMatrixPosition( this.object.matrixWorld );
					
				}
				
			}
			
			this.radius = this.radius * Math.max( this.object.scale.x, this.object.scale.y, this.object.scale.z );
			
		},
		
		getFace3BoundingRadius: function ( object, face ) {

			if ( face.centroid === undefined ) face.centroid = new THREE.Vector3();
			
			var geometry = object.geometry || object,
				vertices = geometry.vertices,
				centroid = face.centroid,
				va = vertices[ face.a ], vb = vertices[ face.b ], vc = vertices[ face.c ],
				centroidToVert = this.utilVec31FaceBounds,
				radius;
				
			centroid.addVectors( va, vb ).add( vc ).divideScalar( 3 );
			radius = Math.max( centroidToVert.subVectors( centroid, va ).length(), centroidToVert.subVectors( centroid, vb ).length(), centroidToVert.subVectors( centroid, vc ).length() );
			
			return radius;
			
		}
		
	};

	/*===================================================

	node

	=====================================================*/

	THREE.OctreeNode = function ( parameters ) {
		
		// utility
		
		this.utilVec31Branch = new THREE.Vector3();
		this.utilVec31Expand = new THREE.Vector3();
		this.utilVec31Ray = new THREE.Vector3();
		
		// handle parameters
		
		parameters = parameters || {};
		
		// store or create tree
		
		if ( parameters.tree instanceof THREE.Octree ) {
			
			this.tree = parameters.tree;
			
		} else if ( parameters.parent instanceof THREE.OctreeNode !== true ) {
			
			parameters.root = this;
			
			this.tree = new THREE.Octree( parameters );
			
		}
		
		// basic properties
		
		this.id = this.tree.nodeCount ++;
		this.position = parameters.position instanceof THREE.Vector3 ? parameters.position : new THREE.Vector3();
		this.radius = parameters.radius > 0 ? parameters.radius : 1;
		this.indexOctant = parameters.indexOctant;
		this.depth = 0;
		
		// reset and assign parent
		
		this.reset();
		this.setParent( parameters.parent );
		
		// additional properties
		
		this.overlap = this.radius * this.tree.overlapPct;
		this.radiusOverlap = this.radius + this.overlap;
		this.left = this.position.x - this.radiusOverlap;
		this.right = this.position.x + this.radiusOverlap;
		this.bottom = this.position.y - this.radiusOverlap;
		this.top = this.position.y + this.radiusOverlap;
		this.back = this.position.z - this.radiusOverlap;
		this.front = this.position.z + this.radiusOverlap;
		
		// visual
		
		if ( this.tree.scene ) {
			
			this.visual = new THREE.Mesh( this.tree.visualGeometry, this.tree.visualMaterial );
			this.visual.scale.set( this.radiusOverlap * 2, this.radiusOverlap * 2, this.radiusOverlap * 2 );
			this.visual.position.copy( this.position );
			this.tree.scene.add( this.visual );
			
		}
		
	};

	THREE.OctreeNode.prototype = {
		
		setParent: function ( parent ) {
			
			// store new parent
			
			if ( parent !== this && this.parent !== parent ) {
				
				this.parent = parent;
				
				// update properties
				
				this.updateProperties();
				
			}
			
		},
		
		updateProperties: function () {
			
			var i, l;
			
			// properties
			
			if ( this.parent instanceof THREE.OctreeNode ) {
				
				this.tree = this.parent.tree;
				this.depth = this.parent.depth + 1;
				
			} else {
				
				this.depth = 0;
				
			}
			
			// cascade
			
			for ( i = 0, l = this.nodesIndices.length; i < l; i ++ ) {
				
				this.nodesByIndex[ this.nodesIndices[ i ] ].updateProperties();
				
			}
			
		},
		
		reset: function ( cascade, removeVisual ) {
			
			var i, l,
				node,
				nodesIndices = this.nodesIndices || [],
				nodesByIndex = this.nodesByIndex;
			
			this.objects = [];
			this.nodesIndices = [];
			this.nodesByIndex = {};
			
			// unset parent in nodes
			
			for ( i = 0, l = nodesIndices.length; i < l; i ++ ) {
				
				node = nodesByIndex[ nodesIndices[ i ] ];
				
				node.setParent( undefined );
				
				if ( cascade === true ) {
					
					node.reset( cascade, removeVisual );
					
				}
				
			}
			
			// visual
			
			if ( removeVisual === true && this.visual && this.visual.parent ) {
				
				this.visual.parent.remove( this.visual );
				
			}
			
		},
		
		addNode: function ( node, indexOctant ) {
			
			node.indexOctant = indexOctant;
			
			if ( indexOfValue( this.nodesIndices, indexOctant ) === - 1 ) {
				
				this.nodesIndices.push( indexOctant );
				
			}
			
			this.nodesByIndex[ indexOctant ] = node;
			
			if ( node.parent !== this ) {
				
				node.setParent( this );
				
			}
			
		},
		
		removeNode: function ( indexOctant ) {
			
			var index,
				node;
				
			index = indexOfValue( this.nodesIndices, indexOctant );
			
			this.nodesIndices.splice( index, 1 );
			
			node = node || this.nodesByIndex[ indexOctant ];
			
			delete this.nodesByIndex[ indexOctant ];
			
			if ( node.parent === this ) {
				
				node.setParent( undefined );
				
			}
			
		},
		
		addObject: function ( object ) {
			
			var index,
				indexOctant,
				node;
			
			// get object octant index
			
			indexOctant = this.getOctantIndex( object );
			
			// if object fully contained by an octant, add to subtree
			if ( indexOctant > - 1 && this.nodesIndices.length > 0 ) {
				
				node = this.branch( indexOctant );
				
				node.addObject( object );
				
			} else if ( indexOctant < - 1 && this.parent instanceof THREE.OctreeNode ) {
				
				// if object lies outside bounds, add to parent node
				
				this.parent.addObject( object );
				
			} else {
				
				// add to this objects list
				
				index = indexOfValue( this.objects, object );
				
				if ( index === - 1 ) {
					
					this.objects.push( object );
					
				}
				
				// node reference
				
				object.node = this;
				
				// check if need to expand, split, or both
				
				this.checkGrow();
				
			}
			
		},
		
		addObjectWithoutCheck: function ( objects ) {
			
			var i, l,
				object;

			for ( i = 0, l = objects.length; i < l; i ++ ) {
				
				object = objects[ i ];
				
				this.objects.push( object );
				
				object.node = this;
				
			}
			
		},
		
		removeObject: function ( object ) {
			
			var i, l,
				nodesRemovedFrom,
				removeData;
			
			// cascade through tree to find and remove object
			
			removeData = this.removeObjectRecursive( object, { searchComplete: false, nodesRemovedFrom: [], objectsDataRemoved: [] } );
			
			// if object removed, try to shrink the nodes it was removed from
			
			nodesRemovedFrom = removeData.nodesRemovedFrom;
			
			if ( nodesRemovedFrom.length > 0 ) {
				
				for ( i = 0, l = nodesRemovedFrom.length; i < l; i ++ ) {
					
					nodesRemovedFrom[ i ].shrink();
					
				}
				
			}
			
			return removeData.objectsDataRemoved;
			
		},
		
		removeObjectRecursive: function ( object, removeData ) {
			
			var i, l,
				index = - 1,
				objectData,
				node,
				objectRemoved;
			
			// find index of object in objects list
			
			// search and remove object data (fast)
			if ( object instanceof THREE.OctreeObjectData ) {
				
				// remove from this objects list
				
				index = indexOfValue( this.objects, object );
				
				if ( index !== - 1 ) {
					
					this.objects.splice( index, 1 );
					object.node = undefined;
					
					removeData.objectsDataRemoved.push( object );
					
					removeData.searchComplete = objectRemoved = true;
					
				}
				
			} else {
			
				// search each object data for object and remove (slow)
				
				for ( i = this.objects.length - 1; i >= 0; i -- ) {
					
					objectData = this.objects[ i ];
					
					if ( objectData.object === object ) {
						
						this.objects.splice( i, 1 );
						objectData.node = undefined;
						
						removeData.objectsDataRemoved.push( objectData );
						
						objectRemoved = true;
						
						if ( ! objectData.faces && ! objectData.vertices ) {
							
							removeData.searchComplete = true;
							break;
							
						}
						
					}
					
				}
				
			}
			
			// if object data removed and this is not on nodes removed from
			
			if ( objectRemoved === true ) {
				
				removeData.nodesRemovedFrom.push( this );
				
			}
			
			// if search not complete, search nodes
			
			if ( removeData.searchComplete !== true ) {
				
				for ( i = 0, l = this.nodesIndices.length; i < l; i ++ ) {
					
					node = this.nodesByIndex[ this.nodesIndices[ i ] ];
					
					// try removing object from node
					
					removeData = node.removeObjectRecursive( object, removeData );
					
					if ( removeData.searchComplete === true ) {
						
						break;
						
					}
					
				}
				
			}
			
			return removeData;
			
		},
		
		checkGrow: function () {
			
			// if object count above max
			
			if ( this.objects.length > this.tree.objectsThreshold && this.tree.objectsThreshold > 0 ) {
				
				this.grow();
				
			}
			
		},
		
		grow: function () {
			
			var indexOctant,
				object,
				objectsExpand = [],
				objectsExpandOctants = [],
				objectsSplit = [],
				objectsSplitOctants = [],
				objectsRemaining = [],
				i, l;
			
			// for each object
			
			for ( i = 0, l = this.objects.length; i < l; i ++ ) {
				
				object = this.objects[ i ];
				
				// get object octant index
				
				indexOctant = this.getOctantIndex( object );
				
				// if lies within octant
				if ( indexOctant > - 1 ) {
					
					objectsSplit.push( object );
					objectsSplitOctants.push( indexOctant );
				
				} else if ( indexOctant < - 1 ) {
					
					// lies outside radius
					
					objectsExpand.push( object );
					objectsExpandOctants.push( indexOctant );
					
				} else {
				
					// lies across bounds between octants
					
					objectsRemaining.push( object );
					
				}
				
			}
			
			// if has objects to split
			
			if ( objectsSplit.length > 0 ) {
				
				objectsRemaining = objectsRemaining.concat( this.split( objectsSplit, objectsSplitOctants ) );
				
			}
			
			// if has objects to expand
			
			if ( objectsExpand.length > 0 ) {
				
				objectsRemaining = objectsRemaining.concat( this.expand( objectsExpand, objectsExpandOctants ) );
				
			}
			
			// store remaining
			
			this.objects = objectsRemaining;
			
			// merge check
			
			this.checkMerge();
			
		},
		
		split: function ( objects, octants ) {
			
			var i, l,
				indexOctant,
				object,
				node,
				objectsRemaining;
			
			// if not at max depth
			
			if ( this.depth < this.tree.depthMax ) {
				
				objects = objects || this.objects;
				
				octants = octants || [];
				
				objectsRemaining = [];
				
				// for each object
				
				for ( i = 0, l = objects.length; i < l; i ++ ) {
					
					object = objects[ i ];
					
					// get object octant index
					
					indexOctant = octants[ i ];
					
					// if object contained by octant, branch this tree
					
					if ( indexOctant > - 1 ) {
						
						node = this.branch( indexOctant );
						
						node.addObject( object );
						
					} else {
						
						objectsRemaining.push( object );
						
					}
					
				}
				
				// if all objects, set remaining as new objects
				
				if ( objects === this.objects ) {
					
					this.objects = objectsRemaining;
					
				}
				
			} else {
				
				objectsRemaining = this.objects;
				
			}
			
			return objectsRemaining;
			
		},
		
		branch: function ( indexOctant ) {
			
			var node,
				overlap,
				radius,
				radiusOffset,
				offset,
				position;
			
			// node exists
			
			if ( this.nodesByIndex[ indexOctant ] instanceof THREE.OctreeNode ) {
				
				node = this.nodesByIndex[ indexOctant ];
				
			} else {
				
				// properties
				
				radius = ( this.radiusOverlap ) * 0.5;
				overlap = radius * this.tree.overlapPct;
				radiusOffset = radius - overlap;
				offset = this.utilVec31Branch.set( indexOctant & 1 ? radiusOffset : - radiusOffset, indexOctant & 2 ? radiusOffset : - radiusOffset, indexOctant & 4 ? radiusOffset : - radiusOffset );
				position = new THREE.Vector3().addVectors( this.position, offset );
				
				// node
				
				node = new THREE.OctreeNode( {
					tree: this.tree,
					parent: this,
					position: position,
					radius: radius,
					indexOctant: indexOctant
				} );
				
				// store
				
				this.addNode( node, indexOctant );
			
			}
			
			return node;
			
		},
		
		expand: function ( objects, octants ) {
			
			var i, l,
				object,
				objectsRemaining,
				objectsExpand,
				indexOctant,
				flagsOutside,
				indexOutside,
				indexOctantInverse,
				iom = this.tree.INDEX_OUTSIDE_MAP,
				indexOutsideCounts,
				infoIndexOutside1,
				infoIndexOutside2,
				infoIndexOutside3,
				indexOutsideBitwise1,
				indexOutsideBitwise2,
				infoPotential1,
				infoPotential2,
				infoPotential3,
				indexPotentialBitwise1,
				indexPotentialBitwise2,
				octantX, octantY, octantZ,
				overlap,
				radius,
				radiusOffset,
				radiusParent,
				overlapParent,
				offset = this.utilVec31Expand,
				position,
				parent;
			
			// handle max depth down tree
			
			if ( this.tree.root.getDepthEnd() < this.tree.depthMax ) {
				
				objects = objects || this.objects;
				octants = octants || [];
				
				objectsRemaining = [];
				objectsExpand = [];
				
				// reset counts
				
				for ( i = 0, l = iom.length; i < l; i ++ ) {
					
					iom[ i ].count = 0;
					
				}
				
				// for all outside objects, find outside octants containing most objects
				
				for ( i = 0, l = objects.length; i < l; i ++ ) {
					
					object = objects[ i ];
					
					// get object octant index
					
					indexOctant = octants[ i ] ;
					
					// if object outside this, include in calculations
					
					if ( indexOctant < - 1 ) {
						
						// convert octant index to outside flags
						
						flagsOutside = - indexOctant - this.tree.INDEX_OUTSIDE_OFFSET;
						
						// check against bitwise flags
						
						// x
						
						if ( flagsOutside & this.tree.FLAG_POS_X ) {
							
							iom[ this.tree.INDEX_OUTSIDE_POS_X ].count ++;
							
						} else if ( flagsOutside & this.tree.FLAG_NEG_X ) {
							
							iom[ this.tree.INDEX_OUTSIDE_NEG_X ].count ++;
							
						}
						
						// y
						
						if ( flagsOutside & this.tree.FLAG_POS_Y ) {
							
							iom[ this.tree.INDEX_OUTSIDE_POS_Y ].count ++;
							
						} else if ( flagsOutside & this.tree.FLAG_NEG_Y ) {
							
							iom[ this.tree.INDEX_OUTSIDE_NEG_Y ].count ++;
							
						}
						
						// z
						
						if ( flagsOutside & this.tree.FLAG_POS_Z ) {
							
							iom[ this.tree.INDEX_OUTSIDE_POS_Z ].count ++;
							
						} else if ( flagsOutside & this.tree.FLAG_NEG_Z ) {
							
							iom[ this.tree.INDEX_OUTSIDE_NEG_Z ].count ++;
							
						}
						
						// store in expand list
						
						objectsExpand.push( object );
						
					} else {
						
						objectsRemaining.push( object );
						
					}
					
				}
				
				// if objects to expand
				
				if ( objectsExpand.length > 0 ) {
					
					// shallow copy index outside map
					
					indexOutsideCounts = iom.slice( 0 );
					
					// sort outside index count so highest is first
					
					indexOutsideCounts.sort( function ( a, b ) {
						
						return b.count - a.count;
						
					} );
					
					// get highest outside indices
					
					// first is first
					infoIndexOutside1 = indexOutsideCounts[ 0 ];
					indexOutsideBitwise1 = infoIndexOutside1.index | 1;
					
					// second is ( one of next two bitwise OR 1 ) that is not opposite of ( first bitwise OR 1 )
					
					infoPotential1 = indexOutsideCounts[ 1 ];
					infoPotential2 = indexOutsideCounts[ 2 ];
					
					infoIndexOutside2 = ( infoPotential1.index | 1 ) !== indexOutsideBitwise1 ? infoPotential1 : infoPotential2;
					indexOutsideBitwise2 = infoIndexOutside2.index | 1;
					
					// third is ( one of next three bitwise OR 1 ) that is not opposite of ( first or second bitwise OR 1 )
					
					infoPotential1 = indexOutsideCounts[ 2 ];
					infoPotential2 = indexOutsideCounts[ 3 ];
					infoPotential3 = indexOutsideCounts[ 4 ];
					
					indexPotentialBitwise1 = infoPotential1.index | 1;
					indexPotentialBitwise2 = infoPotential2.index | 1;
					
					infoIndexOutside3 = indexPotentialBitwise1 !== indexOutsideBitwise1 && indexPotentialBitwise1 !== indexOutsideBitwise2 ? infoPotential1 : indexPotentialBitwise2 !== indexOutsideBitwise1 && indexPotentialBitwise2 !== indexOutsideBitwise2 ? infoPotential2 : infoPotential3;
					
					// get this octant normal based on outside octant indices
					
					octantX = infoIndexOutside1.x + infoIndexOutside2.x + infoIndexOutside3.x;
					octantY = infoIndexOutside1.y + infoIndexOutside2.y + infoIndexOutside3.y;
					octantZ = infoIndexOutside1.z + infoIndexOutside2.z + infoIndexOutside3.z;
					
					// get this octant indices based on octant normal
					
					indexOctant = this.getOctantIndexFromPosition( octantX, octantY, octantZ );
					indexOctantInverse = this.getOctantIndexFromPosition( - octantX, - octantY, - octantZ );
					
					// properties
					
					overlap = this.overlap;
					radius = this.radius;
					
					// radius of parent comes from reversing overlap of this, unless overlap percent is 0
					
					radiusParent = this.tree.overlapPct > 0 ? overlap / ( ( 0.5 * this.tree.overlapPct ) * ( 1 + this.tree.overlapPct ) ) : radius * 2; 
					overlapParent = radiusParent * this.tree.overlapPct;
					
					// parent offset is difference between radius + overlap of parent and child
					
					radiusOffset = ( radiusParent + overlapParent ) - ( radius + overlap );
					offset.set( indexOctant & 1 ? radiusOffset : - radiusOffset, indexOctant & 2 ? radiusOffset : - radiusOffset, indexOctant & 4 ? radiusOffset : - radiusOffset );
					position = new THREE.Vector3().addVectors( this.position, offset );
					
					// parent
					
					parent = new THREE.OctreeNode( {
						tree: this.tree,
						position: position,
						radius: radiusParent
					} );
					
					// set self as node of parent
					
					parent.addNode( this, indexOctantInverse );
					
					// set parent as root
					
					this.tree.setRoot( parent );
					
					// add all expand objects to parent
					
					for ( i = 0, l = objectsExpand.length; i < l; i ++ ) {
						
						this.tree.root.addObject( objectsExpand[ i ] );
						
					}
					
				}
				
				// if all objects, set remaining as new objects
				
				if ( objects === this.objects ) {
					
					this.objects = objectsRemaining;
					
				}
				
			} else {
				
				objectsRemaining = objects;
				
			}
			
			return objectsRemaining;
			
		},
		
		shrink: function () {
			
			// merge check
			
			this.checkMerge();
			
			// contract check
			
			this.tree.root.checkContract();
			
		},
		
		checkMerge: function () {
			
			var nodeParent = this,
				nodeMerge;
			
			// traverse up tree as long as node + entire subtree's object count is under minimum
			
			while ( nodeParent.parent instanceof THREE.OctreeNode && nodeParent.getObjectCountEnd() < this.tree.objectsThreshold ) {
				
				nodeMerge = nodeParent;
				nodeParent = nodeParent.parent;
				
			}
			
			// if parent node is not this, merge entire subtree into merge node
			
			if ( nodeParent !== this ) {
				
				nodeParent.merge( nodeMerge );
				
			}
			
		},
		
		merge: function ( nodes ) {
			
			var i, l,
				j, k,
				node;
			
			// handle nodes
			
			nodes = toArray( nodes );
			
			for ( i = 0, l = nodes.length; i < l; i ++ ) {
				
				node = nodes[ i ];
				
				// gather node + all subtree objects
				
				this.addObjectWithoutCheck( node.getObjectsEnd() );
				
				// reset node + entire subtree
				
				node.reset( true, true );
				
				// remove node
				
				this.removeNode( node.indexOctant, node );
				
			}
			
			// merge check
			
			this.checkMerge();
			
		},
		
		checkContract: function () {
			
			var i, l,
				node,
				nodeObjectsCount,
				nodeHeaviest,
				nodeHeaviestObjectsCount,
				outsideHeaviestObjectsCount;
			
			// find node with highest object count
			
			if ( this.nodesIndices.length > 0 ) {
				
				nodeHeaviestObjectsCount = 0;
				outsideHeaviestObjectsCount = this.objects.length;
				
				for ( i = 0, l = this.nodesIndices.length; i < l; i ++ ) {
					
					node = this.nodesByIndex[ this.nodesIndices[ i ] ];
					
					nodeObjectsCount = node.getObjectCountEnd();
					outsideHeaviestObjectsCount += nodeObjectsCount;
					
					if ( nodeHeaviest instanceof THREE.OctreeNode === false || nodeObjectsCount > nodeHeaviestObjectsCount ) {
						
						nodeHeaviest = node;
						nodeHeaviestObjectsCount = nodeObjectsCount;
						
					}
					
				}
				
				// subtract heaviest count from outside count
				
				outsideHeaviestObjectsCount -= nodeHeaviestObjectsCount;
				
				// if should contract
				
				if ( outsideHeaviestObjectsCount < this.tree.objectsThreshold && nodeHeaviest instanceof THREE.OctreeNode ) {
					
					this.contract( nodeHeaviest );
					
				}
				
			}
			
		},
		
		contract: function ( nodeRoot ) {
			
			var i, l,
				node;
			
			// handle all nodes
			
			for ( i = 0, l = this.nodesIndices.length; i < l; i ++ ) {
				
				node = this.nodesByIndex[ this.nodesIndices[ i ] ];
				
				// if node is not new root
				
				if ( node !== nodeRoot ) {
					
					// add node + all subtree objects to root
					
					nodeRoot.addObjectWithoutCheck( node.getObjectsEnd() );
					
					// reset node + entire subtree
					
					node.reset( true, true );
					
				}
				
			}
			
			// add own objects to root
			
			nodeRoot.addObjectWithoutCheck( this.objects );
			
			// reset self
			
			this.reset( false, true );
			
			// set new root
			
			this.tree.setRoot( nodeRoot );
			
			// contract check on new root
			
			nodeRoot.checkContract();
			
		},
		
		getOctantIndex: function ( objectData ) {
			
			var i, l,
				positionObj,
				radiusObj,
				position = this.position,
				radiusOverlap = this.radiusOverlap,
				overlap = this.overlap,
				deltaX, deltaY, deltaZ,
				distX, distY, distZ, 
				distance,
				indexOctant = 0;
			
			// handle type
			
			if ( objectData instanceof THREE.OctreeObjectData ) {
				
				radiusObj = objectData.radius;
				
				positionObj = objectData.position;
				
				// update object data position last
				
				objectData.positionLast.copy( positionObj );
				
			} else if ( objectData instanceof THREE.OctreeNode ) {
				
				positionObj = objectData.position;
				
				radiusObj = 0;
				
			}
			
			// find delta and distance
			
			deltaX = positionObj.x - position.x;
			deltaY = positionObj.y - position.y;
			deltaZ = positionObj.z - position.z;
			
			distX = Math.abs( deltaX );
			distY = Math.abs( deltaY );
			distZ = Math.abs( deltaZ );
			distance = Math.max( distX, distY, distZ );
			
			// if outside, use bitwise flags to indicate on which sides object is outside of
			
			if ( distance + radiusObj > radiusOverlap ) {
				
				// x
				
				if ( distX + radiusObj > radiusOverlap ) {
					
					indexOctant = indexOctant ^ ( deltaX > 0 ? this.tree.FLAG_POS_X : this.tree.FLAG_NEG_X );
					
				}
				
				// y
				
				if ( distY + radiusObj > radiusOverlap ) {
					
					indexOctant = indexOctant ^ ( deltaY > 0 ? this.tree.FLAG_POS_Y : this.tree.FLAG_NEG_Y );
					
				}
				
				// z
				
				if ( distZ + radiusObj > radiusOverlap ) {
					
					indexOctant = indexOctant ^ ( deltaZ > 0 ? this.tree.FLAG_POS_Z : this.tree.FLAG_NEG_Z );
					
				}
				
				objectData.indexOctant = - indexOctant - this.tree.INDEX_OUTSIDE_OFFSET;
				
				return objectData.indexOctant;
				
			}
			
			// return octant index from delta xyz
			
			if ( deltaX - radiusObj > - overlap ) {
				
				// x right
				
				indexOctant = indexOctant | 1;
				
			} else if ( ! ( deltaX + radiusObj < overlap ) ) {
				
				// x left
				
				objectData.indexOctant = this.tree.INDEX_INSIDE_CROSS;
				return objectData.indexOctant;
				
			}
			
			if ( deltaY - radiusObj > - overlap ) {
				
				// y right
				
				indexOctant = indexOctant | 2;
				
			} else if ( ! ( deltaY + radiusObj < overlap ) ) {
				
				// y left
				
				objectData.indexOctant = this.tree.INDEX_INSIDE_CROSS;
				return objectData.indexOctant;
				
			}
			
			
			if ( deltaZ - radiusObj > - overlap ) {
				
				// z right
				
				indexOctant = indexOctant | 4;
				
			} else if ( ! ( deltaZ + radiusObj < overlap ) ) {
				
				// z left
				
				objectData.indexOctant = this.tree.INDEX_INSIDE_CROSS;
				return objectData.indexOctant;
				
			}
			
			objectData.indexOctant = indexOctant;
			return objectData.indexOctant;
			
		},
		
		getOctantIndexFromPosition: function ( x, y, z ) {
			
			var indexOctant = 0;
			
			if ( x > 0 ) {
				
				indexOctant = indexOctant | 1;
				
			}
			
			if ( y > 0 ) {
				
				indexOctant = indexOctant | 2;
				
			}
			
			if ( z > 0 ) {
				
				indexOctant = indexOctant | 4;
				
			}
			
			return indexOctant;
			
		},
		
		search: function ( position, radius, objects, direction, directionPct ) {
			
			var i, l,
				node,
				intersects;
			
			// test intersects by parameters
			
			if ( direction ) {
				
				intersects = this.intersectRay( position, direction, radius, directionPct );
				
			} else {
				
				intersects = this.intersectSphere( position, radius );
				
			}
			
			// if intersects
			
			if ( intersects === true ) {
				
				// gather objects
				
				objects = objects.concat( this.objects );
				
				// search subtree
				
				for ( i = 0, l = this.nodesIndices.length; i < l; i ++ ) {
					
					node = this.nodesByIndex[ this.nodesIndices[ i ] ];
					
					objects = node.search( position, radius, objects, direction );
					
				}
				
			}
			
			return objects;
			
		},
		
		intersectSphere: function ( position, radius ) {
			
			var	distance = radius * radius,
				px = position.x,
				py = position.y,
				pz = position.z;
			
			if ( px < this.left ) {

				distance -= Math.pow( px - this.left, 2 );

			} else if ( px > this.right ) {

				distance -= Math.pow( px - this.right, 2 );

			}
			
			if ( py < this.bottom ) {

				distance -= Math.pow( py - this.bottom, 2 );

			} else if ( py > this.top ) {

				distance -= Math.pow( py - this.top, 2 );

			}
			
			if ( pz < this.back ) {

				distance -= Math.pow( pz - this.back, 2 );

			} else if ( pz > this.front ) {

				distance -= Math.pow( pz - this.front, 2 );

			}
			
			return distance >= 0;
			
		},
		
		intersectRay: function ( origin, direction, distance, directionPct ) {
			
			if ( typeof directionPct === 'undefined' ) {
				
				directionPct = this.utilVec31Ray.set( 1, 1, 1 ).divide( direction );
				
			}
			
			var t1 = ( this.left - origin.x ) * directionPct.x,
				t2 = ( this.right - origin.x ) * directionPct.x,
				t3 = ( this.bottom - origin.y ) * directionPct.y,
				t4 = ( this.top - origin.y ) * directionPct.y,
				t5 = ( this.back - origin.z ) * directionPct.z,
				t6 = ( this.front - origin.z ) * directionPct.z,
				tmax = Math.min( Math.min( Math.max( t1, t2 ), Math.max( t3, t4 ) ), Math.max( t5, t6 ) ),
				tmin;

			// ray would intersect in reverse direction, i.e. this is behind ray
			if ( tmax < 0 ) {

				return false;

			}
			
			tmin = Math.max( Math.max( Math.min( t1, t2 ), Math.min( t3, t4 ) ), Math.min( t5, t6 ) );
			
			// if tmin > tmax or tmin > ray distance, ray doesn't intersect AABB
			if ( tmin > tmax || tmin > distance ) {

				return false;

			}
			
			return true;
			
		},
		
		getDepthEnd: function ( depth ) {
			
			var i, l,
				node;

			if ( this.nodesIndices.length > 0 ) {
				
				for ( i = 0, l = this.nodesIndices.length; i < l; i ++ ) {

					node = this.nodesByIndex[ this.nodesIndices[ i ] ];

					depth = node.getDepthEnd( depth );

				}
				
			} else {

				depth = ! depth || this.depth > depth ? this.depth : depth;

			}

			return depth;
			
		},
		
		getNodeCountEnd: function () {
			
			return this.tree.root.getNodeCountRecursive() + 1;
			
		},
		
		getNodeCountRecursive: function () {
			
			var i, l,
				count = this.nodesIndices.length;
			
			for ( i = 0, l = this.nodesIndices.length; i < l; i ++ ) {
				
				count += this.nodesByIndex[ this.nodesIndices[ i ] ].getNodeCountRecursive();
				
			}
			
			return count;
			
		},
		
		getObjectsEnd: function ( objects ) {
			
			var i, l,
				node;
			
			objects = ( objects || [] ).concat( this.objects );
			
			for ( i = 0, l = this.nodesIndices.length; i < l; i ++ ) {
				
				node = this.nodesByIndex[ this.nodesIndices[ i ] ];
				
				objects = node.getObjectsEnd( objects );
				
			}
			
			return objects;
			
		},
		
		getObjectCountEnd: function () {
			
			var i, l,
				count = this.objects.length;
			
			for ( i = 0, l = this.nodesIndices.length; i < l; i ++ ) {
				
				count += this.nodesByIndex[ this.nodesIndices[ i ] ].getObjectCountEnd();
				
			}
			
			return count;
			
		},
		
		getObjectCountStart: function () {
			
			var count = this.objects.length,
				parent = this.parent;
			
			while ( parent instanceof THREE.OctreeNode ) {
				
				count += parent.objects.length;
				parent = parent.parent;
				
			}
			
			return count;
			
		},
		
		toConsole: function ( space ) {
			
			var i, l,
				node,
				spaceAddition = '   ';
			
			space = typeof space === 'string' ? space : spaceAddition;
			
			console.log( ( this.parent ? space + ' octree NODE > ' : ' octree ROOT > ' ), this, ' // id: ', this.id, ' // indexOctant: ', this.indexOctant, ' // position: ', this.position.x, this.position.y, this.position.z, ' // radius: ', this.radius, ' // depth: ', this.depth );
			console.log( ( this.parent ? space + ' ' : ' ' ), '+ objects ( ', this.objects.length, ' ) ', this.objects );
			console.log( ( this.parent ? space + ' ' : ' ' ), '+ children ( ', this.nodesIndices.length, ' )', this.nodesIndices, this.nodesByIndex );
			
			for ( i = 0, l = this.nodesIndices.length; i < l; i ++ ) {
				
				node = this.nodesByIndex[ this.nodesIndices[ i ] ];
				
				node.toConsole( space + spaceAddition );
				
			}
			
		}
		
	};

	/*===================================================

	raycaster additional functionality

	=====================================================*/
	
	THREE.Raycaster.prototype.intersectOctreeObject = function ( object, recursive ) {
		
		var intersects,
			octreeObject,
			facesAll,
			facesSearch;
		
		if ( object.object instanceof THREE.Object3D ) {
			
			octreeObject = object;
			object = octreeObject.object;
			
			// temporarily replace object geometry's faces with octree object faces
			
			facesSearch = octreeObject.faces;
			facesAll = object.geometry.faces;
			
			if ( facesSearch.length > 0 ) {
				
				object.geometry.faces = facesSearch;
				
			}
			
			// intersect
			
			intersects = this.intersectObject( object, recursive );
			
			// revert object geometry's faces
			
			if ( facesSearch.length > 0 ) {
				
				object.geometry.faces = facesAll;
				
			}
			
		} else {
			
			intersects = this.intersectObject( object, recursive );
			
		}
		
		return intersects;
		
	};
	
	THREE.Raycaster.prototype.intersectOctreeObjects = function ( objects, recursive ) {
		
		var i, il,
			intersects = [];
		
		for ( i = 0, il = objects.length; i < il; i ++ ) {
			
			intersects = intersects.concat( this.intersectOctreeObject( objects[ i ], recursive ) );
		
		}
		
		return intersects;
		
	};

}( THREE ) );

// Park-Miller-Carta Pseudo-Random Number Generator
// https://github.com/pnitsch/BitmapData.js/blob/master/js/BitmapData.js

var PRNG = function () {

	this.seed = 1;
	this.next = function() {

		return ( this.gen() / 2147483647 );

	};
	this.nextRange = function( min, max )	{

		return min + ( ( max - min ) * this.next() )

	};
	this.gen = function() {

		return this.seed = ( this.seed * 16807 ) % 2147483647;

	};

};

/*
 * @author zz85
 *
 * Experimenting of primitive geometry creation using Surface Parametric equations
 *
 */


THREE.ParametricGeometries = {

	klein: function ( v, u ) {

		u *= Math.PI;
		v *= 2 * Math.PI;

		u = u * 2;
		var x, y, z;
		if ( u < Math.PI ) {

			x = 3 * Math.cos( u ) * ( 1 + Math.sin( u ) ) + ( 2 * ( 1 - Math.cos( u ) / 2 ) ) * Math.cos( u ) * Math.cos( v );
			z = - 8 * Math.sin( u ) - 2 * ( 1 - Math.cos( u ) / 2 ) * Math.sin( u ) * Math.cos( v );

		} else {

			x = 3 * Math.cos( u ) * ( 1 + Math.sin( u ) ) + ( 2 * ( 1 - Math.cos( u ) / 2 ) ) * Math.cos( v + Math.PI );
			z = - 8 * Math.sin( u );

		}

		y = - 2 * ( 1 - Math.cos( u ) / 2 ) * Math.sin( v );

		return new THREE.Vector3( x, y, z );

	},

	plane: function ( width, height ) {

		return function( u, v ) {

			var x = u * width;
			var y = 0;
			var z = v * height;

			return new THREE.Vector3( x, y, z );

		};

	},

	mobius: function( u, t ) {

		// flat mobius strip
		// http://www.wolframalpha.com/input/?i=M%C3%B6bius+strip+parametric+equations&lk=1&a=ClashPrefs_*Surface.MoebiusStrip.SurfaceProperty.ParametricEquations-
		u = u - 0.5;
		var v = 2 * Math.PI * t;

		var x, y, z;

		var a = 2;
		x = Math.cos( v ) * ( a + u * Math.cos( v / 2 ) );
		y = Math.sin( v ) * ( a + u * Math.cos( v / 2 ) );
		z = u * Math.sin( v / 2 );
		return new THREE.Vector3( x, y, z );

	},

	mobius3d: function( u, t ) {

		// volumetric mobius strip
		u *= Math.PI;
		t *= 2 * Math.PI;

		u = u * 2;
		var phi = u / 2;
		var major = 2.25, a = 0.125, b = 0.65;
		var x, y, z;
		x = a * Math.cos( t ) * Math.cos( phi ) - b * Math.sin( t ) * Math.sin( phi );
		z = a * Math.cos( t ) * Math.sin( phi ) + b * Math.sin( t ) * Math.cos( phi );
		y = ( major + x ) * Math.sin( u );
		x = ( major + x ) * Math.cos( u );
		return new THREE.Vector3( x, y, z );

	}

};


/*********************************************
 *
 * Parametric Replacement for TubeGeometry
 *
 *********************************************/

THREE.ParametricGeometries.TubeGeometry = function( path, segments, radius, segmentsRadius, closed, debug ) {

	this.path = path;
	this.segments = segments || 64;
	this.radius = radius || 1;
	this.segmentsRadius = segmentsRadius || 8;
	this.closed = closed || false;
	if ( debug ) this.debug = new THREE.Object3D();


	var scope = this,

		tangent, normal, binormal,

		numpoints = this.segments + 1,

		x, y, z, tx, ty, tz, u, v,

		cx, cy, pos, pos2 = new THREE.Vector3(),
		i, j, ip, jp, a, b, c, d, uva, uvb, uvc, uvd;

	var frames = new THREE.TubeGeometry.FrenetFrames( path, segments, closed ),
		tangents = frames.tangents,
		normals = frames.normals,
		binormals = frames.binormals;

	// proxy internals
	this.tangents = tangents;
	this.normals = normals;
	this.binormals = binormals;



	var ParametricTube = function( u, v ) {

		v *= 2 * Math.PI;

		i = u * ( numpoints - 1 );
		i = Math.floor( i );

		pos = path.getPointAt( u );

		tangent = tangents[ i ];
		normal = normals[ i ];
		binormal = binormals[ i ];

		if ( scope.debug ) {

			scope.debug.add( new THREE.ArrowHelper( tangent, pos, radius, 0x0000ff ) );
			scope.debug.add( new THREE.ArrowHelper( normal, pos, radius, 0xff0000 ) );
			scope.debug.add( new THREE.ArrowHelper( binormal, pos, radius, 0x00ff00 ) );

		}

		cx = - scope.radius * Math.cos( v ); // TODO: Hack: Negating it so it faces outside.
		cy = scope.radius * Math.sin( v );

		pos2.copy( pos );
		pos2.x += cx * normal.x + cy * binormal.x;
		pos2.y += cx * normal.y + cy * binormal.y;
		pos2.z += cx * normal.z + cy * binormal.z;

		return pos2.clone();

	};

	THREE.ParametricGeometry.call( this, ParametricTube, segments, segmentsRadius );

};

THREE.ParametricGeometries.TubeGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.ParametricGeometries.TubeGeometry.prototype.constructor = THREE.ParametricGeometries.TubeGeometry;


 /*********************************************
  *
  * Parametric Replacement for TorusKnotGeometry
  *
  *********************************************/
THREE.ParametricGeometries.TorusKnotGeometry = function ( radius, tube, segmentsT, segmentsR, p, q ) {

	var scope = this;

	this.radius = radius || 200;
	this.tube = tube || 40;
	this.segmentsT = segmentsT || 64;
	this.segmentsR = segmentsR || 8;
	this.p = p || 2;
	this.q = q || 3;

	var TorusKnotCurve = THREE.Curve.create(

		function() {
		},

		function( t ) {

			t *= Math.PI * 2;

			var r = 0.5;

			var tx = ( 1 + r * Math.cos( q * t ) ) * Math.cos( p * t ),
				ty = ( 1 + r * Math.cos( q * t ) ) * Math.sin( p * t ),
				tz = r * Math.sin( q * t );

			return new THREE.Vector3( tx, ty, tz ).multiplyScalar( radius );

		}

	);
	var segments = segmentsT;
	var radiusSegments = segmentsR;
	var extrudePath = new TorusKnotCurve();

	THREE.ParametricGeometries.TubeGeometry.call( this, extrudePath, segments, tube, radiusSegments, true, false );


};

THREE.ParametricGeometries.TorusKnotGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.ParametricGeometries.TorusKnotGeometry.prototype.constructor = THREE.ParametricGeometries.TorusKnotGeometry;


 /*********************************************
  *
  * Parametric Replacement for SphereGeometry
  *
  *********************************************/
THREE.ParametricGeometries.SphereGeometry = function( size, u, v ) {

	function sphere( u, v ) {

		u *= Math.PI;
		v *= 2 * Math.PI;

		var x = size * Math.sin( u ) * Math.cos( v );
		var y = size * Math.sin( u ) * Math.sin( v );
		var z = size * Math.cos( u );


		return new THREE.Vector3( x, y, z );

	}

	THREE.ParametricGeometry.call( this, sphere, u, v, ! true );

};

THREE.ParametricGeometries.SphereGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.ParametricGeometries.SphereGeometry.prototype.constructor = THREE.ParametricGeometries.SphereGeometry;


 /*********************************************
  *
  * Parametric Replacement for PlaneGeometry
  *
  *********************************************/

THREE.ParametricGeometries.PlaneGeometry = function( width, depth, segmentsWidth, segmentsDepth ) {

	function plane( u, v ) {

		var x = u * width;
		var y = 0;
		var z = v * depth;

		return new THREE.Vector3( x, y, z );

	}

	THREE.ParametricGeometry.call( this, plane, segmentsWidth, segmentsDepth );

};

THREE.ParametricGeometries.PlaneGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.ParametricGeometries.PlaneGeometry.prototype.constructor = THREE.ParametricGeometries.PlaneGeometry;

/**
 * @author mrdoob / http://mrdoob.com/
 */

var RollerCoasterGeometry = function ( curve, size ) {

	THREE.BufferGeometry.call( this );

	var vertices = [];
	var normals = [];
	var colors = [];

	var color1 = [ 1, 1, 1 ];
	var color2 = [ 1, 1, 0 ];

	var up = new THREE.Vector3( 0, 1, 0 );
	var forward = new THREE.Vector3();
	var right = new THREE.Vector3();

	var quaternion = new THREE.Quaternion();
	var prevQuaternion = new THREE.Quaternion();
	prevQuaternion.setFromAxisAngle( up , Math.PI / 2 );

	var point = new THREE.Vector3();
	var prevPoint = new THREE.Vector3();
	prevPoint.copy( curve.getPointAt( 0 ) );

	// shapes

	var step = [
		new THREE.Vector3( -2.25,  0, 0 ),
		new THREE.Vector3(  0,  -0.5, 0 ),
		new THREE.Vector3(  0, -1.75, 0 ),

		new THREE.Vector3(  0,  -0.5, 0 ),
		new THREE.Vector3(  2.25,  0, 0 ),
		new THREE.Vector3(  0, -1.75, 0 )
	];

	var PI2 = Math.PI * 2;

	var sides = 5;
	var tube1 = [];

	for ( var i = 0; i < sides; i ++ ) {

		var angle = ( i / sides ) * PI2;
		tube1.push( new THREE.Vector3( Math.sin( angle ) * 0.6, Math.cos( angle ) * 0.6, 0 ) );

	}

	var sides = 6;
	var tube2 = [];

	for ( var i = 0; i < sides; i ++ ) {

		var angle = ( i / sides ) * PI2;
		tube2.push( new THREE.Vector3( Math.sin( angle ) * 0.25, Math.cos( angle ) * 0.25, 0 ) );

	}

	var vector = new THREE.Vector3();
	var normal = new THREE.Vector3();

	var drawShape = function ( shape, color ) {

		normal.set( 0, 0, -1 ).applyQuaternion( quaternion );

		for ( var j = 0; j < shape.length; j ++ ) {

			vector.copy( shape[ j ] );
			vector.applyQuaternion( quaternion );
			vector.add( point );

			vertices.push( vector.x, vector.y, vector.z );
			normals.push( normal.x, normal.y, normal.z );
			colors.push( color[ 0 ], color[ 1 ], color[ 2 ] );

		}

		normal.set( 0, 0, 1 ).applyQuaternion( quaternion );

		for ( var j = shape.length - 1; j >= 0; j -- ) {

			vector.copy( shape[ j ] );
			vector.applyQuaternion( quaternion );
			vector.add( point );

			vertices.push( vector.x, vector.y, vector.z );
			normals.push( normal.x, normal.y, normal.z );
			colors.push( color[ 0 ], color[ 1 ], color[ 2 ] );

		}

	};

	var vector1 = new THREE.Vector3();
	var vector2 = new THREE.Vector3();
	var vector3 = new THREE.Vector3();
	var vector4 = new THREE.Vector3();

	var normal1 = new THREE.Vector3();
	var normal2 = new THREE.Vector3();
	var normal3 = new THREE.Vector3();
	var normal4 = new THREE.Vector3();

	var extrudeShape = function ( shape, offset, color ) {

		for ( var j = 0, jl = shape.length; j < jl; j ++ ) {

			var point1 = shape[ j ];
			var point2 = shape[ ( j + 1 ) % jl ];

			vector1.copy( point1 ).add( offset );
			vector1.applyQuaternion( quaternion );
			vector1.add( point );

			vector2.copy( point2 ).add( offset );
			vector2.applyQuaternion( quaternion );
			vector2.add( point );

			vector3.copy( point2 ).add( offset );
			vector3.applyQuaternion( prevQuaternion );
			vector3.add( prevPoint );

			vector4.copy( point1 ).add( offset );
			vector4.applyQuaternion( prevQuaternion );
			vector4.add( prevPoint );

			vertices.push( vector1.x, vector1.y, vector1.z );
			vertices.push( vector2.x, vector2.y, vector2.z );
			vertices.push( vector4.x, vector4.y, vector4.z );

			vertices.push( vector2.x, vector2.y, vector2.z );
			vertices.push( vector3.x, vector3.y, vector3.z );
			vertices.push( vector4.x, vector4.y, vector4.z );

			//

			normal1.copy( point1 );
			normal1.applyQuaternion( quaternion );
			normal1.normalize();

			normal2.copy( point2 );
			normal2.applyQuaternion( quaternion );
			normal2.normalize();

			normal3.copy( point2 );
			normal3.applyQuaternion( prevQuaternion );
			normal3.normalize();

			normal4.copy( point1 );
			normal4.applyQuaternion( prevQuaternion );
			normal4.normalize();

			normals.push( normal1.x, normal1.y, normal1.z );
			normals.push( normal2.x, normal2.y, normal2.z );
			normals.push( normal4.x, normal4.y, normal4.z );

			normals.push( normal2.x, normal2.y, normal2.z );
			normals.push( normal3.x, normal3.y, normal3.z );
			normals.push( normal4.x, normal4.y, normal4.z );

			colors.push( color[ 0 ], color[ 1 ], color[ 2 ] );
			colors.push( color[ 0 ], color[ 1 ], color[ 2 ] );
			colors.push( color[ 0 ], color[ 1 ], color[ 2 ] );

			colors.push( color[ 0 ], color[ 1 ], color[ 2 ] );
			colors.push( color[ 0 ], color[ 1 ], color[ 2 ] );
			colors.push( color[ 0 ], color[ 1 ], color[ 2 ] );

		}

	};

	var offset = new THREE.Vector3();

	for ( var i = 1; i <= size; i ++ ) {

		point.copy( curve.getPointAt( i / size ) );

		up.set( 0, 1, 0 );

		forward.subVectors( point, prevPoint ).normalize();
		right.crossVectors( up, forward ).normalize();
		up.crossVectors( forward, right );

		var angle = Math.atan2( forward.x, forward.z );

		quaternion.setFromAxisAngle( up, angle );

		if ( i % 2 === 0 ) {

			drawShape( step, color2 );

		}

		extrudeShape( tube1, offset.set( 0, -1.25, 0 ), color2 );
		extrudeShape( tube2, offset.set( 2, 0, 0 ), color1 );
		extrudeShape( tube2, offset.set( -2, 0, 0 ), color1 );

		prevPoint.copy( point );
		prevQuaternion.copy( quaternion );

	}

	// console.log( vertices.length );

	this.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( vertices ), 3 ) );
	this.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( normals ), 3 ) );
	this.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( colors ), 3 ) );

};

RollerCoasterGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );

var RollerCoasterLiftersGeometry = function ( curve, size ) {

	THREE.BufferGeometry.call( this );

	var vertices = [];
	var normals = [];

	var quaternion = new THREE.Quaternion();

	var up = new THREE.Vector3( 0, 1, 0 );

	var point = new THREE.Vector3();
	var tangent = new THREE.Vector3();

	// shapes

	var tube1 = [
		new THREE.Vector3(  0,  0.5, -0.5 ),
		new THREE.Vector3(  0,  0.5,  0.5 ),
		new THREE.Vector3(  0, -0.5,  0 )
	];

	var tube2 = [
		new THREE.Vector3( -0.5, 0,  0.5 ),
		new THREE.Vector3( -0.5, 0, -0.5 ),
		new THREE.Vector3(  0.5, 0,  0 )
	];

	var tube3 = [
		new THREE.Vector3(  0.5, 0, -0.5 ),
		new THREE.Vector3(  0.5, 0,  0.5 ),
		new THREE.Vector3( -0.5, 0,  0 )
	];

	var vector1 = new THREE.Vector3();
	var vector2 = new THREE.Vector3();
	var vector3 = new THREE.Vector3();
	var vector4 = new THREE.Vector3();

	var normal1 = new THREE.Vector3();
	var normal2 = new THREE.Vector3();
	var normal3 = new THREE.Vector3();
	var normal4 = new THREE.Vector3();

	var extrudeShape = function ( shape, fromPoint, toPoint ) {

		for ( var j = 0, jl = shape.length; j < jl; j ++ ) {

			var point1 = shape[ j ];
			var point2 = shape[ ( j + 1 ) % jl ];

			vector1.copy( point1 )
			vector1.applyQuaternion( quaternion );
			vector1.add( fromPoint );

			vector2.copy( point2 )
			vector2.applyQuaternion( quaternion );
			vector2.add( fromPoint );

			vector3.copy( point2 )
			vector3.applyQuaternion( quaternion );
			vector3.add( toPoint );

			vector4.copy( point1 )
			vector4.applyQuaternion( quaternion );
			vector4.add( toPoint );

			vertices.push( vector1.x, vector1.y, vector1.z );
			vertices.push( vector2.x, vector2.y, vector2.z );
			vertices.push( vector4.x, vector4.y, vector4.z );

			vertices.push( vector2.x, vector2.y, vector2.z );
			vertices.push( vector3.x, vector3.y, vector3.z );
			vertices.push( vector4.x, vector4.y, vector4.z );

			//

			normal1.copy( point1 );
			normal1.applyQuaternion( quaternion );
			normal1.normalize();

			normal2.copy( point2 );
			normal2.applyQuaternion( quaternion );
			normal2.normalize();

			normal3.copy( point2 );
			normal3.applyQuaternion( quaternion );
			normal3.normalize();

			normal4.copy( point1 );
			normal4.applyQuaternion( quaternion );
			normal4.normalize();

			normals.push( normal1.x, normal1.y, normal1.z );
			normals.push( normal2.x, normal2.y, normal2.z );
			normals.push( normal4.x, normal4.y, normal4.z );

			normals.push( normal2.x, normal2.y, normal2.z );
			normals.push( normal3.x, normal3.y, normal3.z );
			normals.push( normal4.x, normal4.y, normal4.z );

		}

	};

	var fromPoint = new THREE.Vector3();
	var toPoint = new THREE.Vector3();

	for ( var i = 1; i <= size; i ++ ) {

		point.copy( curve.getPointAt( i / size ) );
		tangent.copy( curve.getTangentAt( i / size ) );

		var angle = Math.atan2( tangent.x, tangent.z );

		quaternion.setFromAxisAngle( up, angle );

		//

		if ( point.y > 100 ) {

			fromPoint.set( -7.5, -3.5, 0 );
			fromPoint.applyQuaternion( quaternion );
			fromPoint.add( point );

			toPoint.set( 7.5, -3.5, 0 );
			toPoint.applyQuaternion( quaternion );
			toPoint.add( point );

			extrudeShape( tube1, fromPoint, toPoint );

			fromPoint.set( -7, -3, 0 );
			fromPoint.applyQuaternion( quaternion );
			fromPoint.add( point );

			toPoint.set( -7, -point.y, 0 );
			toPoint.applyQuaternion( quaternion );
			toPoint.add( point );

			extrudeShape( tube2, fromPoint, toPoint );

			fromPoint.set( 7, -3, 0 );
			fromPoint.applyQuaternion( quaternion );
			fromPoint.add( point );

			toPoint.set( 7, -point.y, 0 );
			toPoint.applyQuaternion( quaternion );
			toPoint.add( point );

			extrudeShape( tube3, fromPoint, toPoint );

		} else {

			fromPoint.set( 0, -2, 0 );
			fromPoint.applyQuaternion( quaternion );
			fromPoint.add( point );

			toPoint.set( 0, -point.y, 0 );
			toPoint.applyQuaternion( quaternion );
			toPoint.add( point );

			extrudeShape( tube3, fromPoint, toPoint );

		}

	}

	this.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( vertices ), 3 ) );
	this.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( normals ), 3 ) );

};

RollerCoasterLiftersGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );

var RollerCoasterShadowGeometry = function ( curve, size ) {

	THREE.BufferGeometry.call( this );

	var vertices = [];

	var up = new THREE.Vector3( 0, 1, 0 );
	var forward = new THREE.Vector3();

	var quaternion = new THREE.Quaternion();
	var prevQuaternion = new THREE.Quaternion();
	prevQuaternion.setFromAxisAngle( up , Math.PI / 2 );

	var point = new THREE.Vector3();

	var prevPoint = new THREE.Vector3();
	prevPoint.copy( curve.getPointAt( 0 ) );
	prevPoint.y = 0;

	var vector1 = new THREE.Vector3();
	var vector2 = new THREE.Vector3();
	var vector3 = new THREE.Vector3();
	var vector4 = new THREE.Vector3();

	for ( var i = 1; i <= size; i ++ ) {

		point.copy( curve.getPointAt( i / size ) );
		point.y = 0;

		forward.subVectors( point, prevPoint );

		var angle = Math.atan2( forward.x, forward.z );

		quaternion.setFromAxisAngle( up, angle );

		vector1.set( -3, 0, 0 );
		vector1.applyQuaternion( quaternion );
		vector1.add( point );

		vector2.set(  3, 0, 0 );
		vector2.applyQuaternion( quaternion );
		vector2.add( point );

		vector3.set(  3, 0, 0 );
		vector3.applyQuaternion( prevQuaternion );
		vector3.add( prevPoint );

		vector4.set( -3, 0, 0 );
		vector4.applyQuaternion( prevQuaternion );
		vector4.add( prevPoint );

		vertices.push( vector1.x, vector1.y, vector1.z );
		vertices.push( vector2.x, vector2.y, vector2.z );
		vertices.push( vector4.x, vector4.y, vector4.z );

		vertices.push( vector2.x, vector2.y, vector2.z );
		vertices.push( vector3.x, vector3.y, vector3.z );
		vertices.push( vector4.x, vector4.y, vector4.z );

		prevPoint.copy( point );
		prevQuaternion.copy( quaternion );

	}

	this.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( vertices ), 3 ) );

};

RollerCoasterShadowGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );

var SkyGeometry = function () {

	THREE.BufferGeometry.call( this );

	var vertices = [];

	for ( var i = 0; i < 100; i ++ ) {

		var x = Math.random() * 8000 - 4000;
		var y = Math.random() * 500 + 500;
		var z = Math.random() * 8000 - 4000;

		var size = Math.random() * 400 + 200;

		vertices.push( x - size, y, z - size );
		vertices.push( x + size, y, z - size );
		vertices.push( x - size, y, z + size );

		vertices.push( x + size, y, z - size );
		vertices.push( x + size, y, z + size );
		vertices.push( x - size, y, z + size );

	}


	this.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( vertices ), 3 ) );

};

SkyGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );

var TreesGeometry = function ( landscape ) {

	THREE.BufferGeometry.call( this );

	var vertices = [];
	var colors = [];

	var raycaster = new THREE.Raycaster();
	raycaster.ray.direction.set( 0, -1, 0 );

	for ( var i = 0; i < 2000; i ++ ) {

		var x = Math.random() * 5000 - 2500;
		var z = Math.random() * 5000 - 2500;

		raycaster.ray.origin.set( x, 500, z );

		var intersections = raycaster.intersectObject( landscape );

		if ( intersections.length === 0 ) continue;

		var y = intersections[ 0 ].point.y;

		var height = Math.random() * 50 + 5;

		var angle = Math.random() * Math.PI * 2;

		vertices.push( x + Math.sin( angle ) * 10, y, z + Math.cos( angle ) * 10 );
		vertices.push( x, y + height, z );
		vertices.push( x + Math.sin( angle + Math.PI ) * 10, y, z + Math.cos( angle + Math.PI ) * 10 );

		angle += Math.PI / 2;

		vertices.push( x + Math.sin( angle ) * 10, y, z + Math.cos( angle ) * 10 );
		vertices.push( x, y + height, z );
		vertices.push( x + Math.sin( angle + Math.PI ) * 10, y, z + Math.cos( angle + Math.PI ) * 10 );

		var random = Math.random() * 0.1;

		for ( var j = 0; j < 6; j ++ ) {

			colors.push( 0.2 + random, 0.4 + random, 0 );

		}

	}

	this.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( vertices ), 3 ) );
	this.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( colors ), 3 ) );

};

TreesGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );

/**
 * @author huwb / http://huwbowles.com/
 *
 * God-rays (crepuscular rays)
 *
 * Similar implementation to the one used by Crytek for CryEngine 2 [Sousa2008].
 * Blurs a mask generated from the depth map along radial lines emanating from the light
 * source. The blur repeatedly applies a blur filter of increasing support but constant
 * sample count to produce a blur filter with large support.
 *
 * My implementation performs 3 passes, similar to the implementation from Sousa. I found
 * just 6 samples per pass produced acceptible results. The blur is applied three times,
 * with decreasing filter support. The result is equivalent to a single pass with
 * 6*6*6 = 216 samples.
 *
 * References:
 *
 * Sousa2008 - Crysis Next Gen Effects, GDC2008, http://www.crytek.com/sites/default/files/GDC08_SousaT_CrysisEffects.ppt
 */

THREE.ShaderGodRays = {

	/**
	 * The god-ray generation shader.
	 *
	 * First pass:
	 *
	 * The input is the depth map. I found that the output from the
	 * THREE.MeshDepthMaterial material was directly suitable without
	 * requiring any treatment whatsoever.
	 *
	 * The depth map is blurred along radial lines towards the "sun". The
	 * output is written to a temporary render target (I used a 1/4 sized
	 * target).
	 *
	 * Pass two & three:
	 *
	 * The results of the previous pass are re-blurred, each time with a
	 * decreased distance between samples.
	 */

	'godrays_generate': {

		uniforms: {

			tInput: {
				value: null
			},
			fStepSize: {
				value: 1.0
			},
			vSunPositionScreenSpace: {
				value: new THREE.Vector2( 0.5, 0.5 )
			}

		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join( "\n" ),

		fragmentShader: [

			"#define TAPS_PER_PASS 6.0",

			"varying vec2 vUv;",

			"uniform sampler2D tInput;",

			"uniform vec2 vSunPositionScreenSpace;",
			"uniform float fStepSize;", // filter step size

			"void main() {",

				// delta from current pixel to "sun" position

				"vec2 delta = vSunPositionScreenSpace - vUv;",
				"float dist = length( delta );",

				// Step vector (uv space)

				"vec2 stepv = fStepSize * delta / dist;",

				// Number of iterations between pixel and sun

				"float iters = dist/fStepSize;",

				"vec2 uv = vUv.xy;",
				"float col = 0.0;",

				// This breaks ANGLE in Chrome 22
				//	- see http://code.google.com/p/chromium/issues/detail?id=153105

				/*
				// Unrolling didnt do much on my hardware (ATI Mobility Radeon 3450),
				// so i've just left the loop

				"for ( float i = 0.0; i < TAPS_PER_PASS; i += 1.0 ) {",

					// Accumulate samples, making sure we dont walk past the light source.

					// The check for uv.y < 1 would not be necessary with "border" UV wrap
					// mode, with a black border colour. I don't think this is currently
					// exposed by three.js. As a result there might be artifacts when the
					// sun is to the left, right or bottom of screen as these cases are
					// not specifically handled.

					"col += ( i <= iters && uv.y < 1.0 ? texture2D( tInput, uv ).r : 0.0 );",
					"uv += stepv;",

				"}",
				*/

				// Unrolling loop manually makes it work in ANGLE

				"if ( 0.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv ).r;",
				"uv += stepv;",

				"if ( 1.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv ).r;",
				"uv += stepv;",

				"if ( 2.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv ).r;",
				"uv += stepv;",

				"if ( 3.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv ).r;",
				"uv += stepv;",

				"if ( 4.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv ).r;",
				"uv += stepv;",

				"if ( 5.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv ).r;",
				"uv += stepv;",

				// Should technically be dividing by 'iters', but 'TAPS_PER_PASS' smooths out
				// objectionable artifacts, in particular near the sun position. The side
				// effect is that the result is darker than it should be around the sun, as
				// TAPS_PER_PASS is greater than the number of samples actually accumulated.
				// When the result is inverted (in the shader 'godrays_combine', this produces
				// a slight bright spot at the position of the sun, even when it is occluded.

				"gl_FragColor = vec4( col/TAPS_PER_PASS );",
				"gl_FragColor.a = 1.0;",

			"}"

		].join( "\n" )

	},

	/**
	 * Additively applies god rays from texture tGodRays to a background (tColors).
	 * fGodRayIntensity attenuates the god rays.
	 */

	'godrays_combine': {

		uniforms: {

			tColors: {
				value: null
			},

			tGodRays: {
				value: null
			},

			fGodRayIntensity: {
				value: 0.69
			},

			vSunPositionScreenSpace: {
				value: new THREE.Vector2( 0.5, 0.5 )
			}

		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

			].join( "\n" ),

		fragmentShader: [

			"varying vec2 vUv;",

			"uniform sampler2D tColors;",
			"uniform sampler2D tGodRays;",

			"uniform vec2 vSunPositionScreenSpace;",
			"uniform float fGodRayIntensity;",

			"void main() {",

				// Since THREE.MeshDepthMaterial renders foreground objects white and background
				// objects black, the god-rays will be white streaks. Therefore value is inverted
				// before being combined with tColors

				"gl_FragColor = texture2D( tColors, vUv ) + fGodRayIntensity * vec4( 1.0 - texture2D( tGodRays, vUv ).r );",
				"gl_FragColor.a = 1.0;",

			"}"

		].join( "\n" )

	},


	/**
	 * A dodgy sun/sky shader. Makes a bright spot at the sun location. Would be
	 * cheaper/faster/simpler to implement this as a simple sun sprite.
	 */

	'godrays_fake_sun': {

		uniforms: {

			vSunPositionScreenSpace: {
				value: new THREE.Vector2( 0.5, 0.5 )
			},

			fAspect: {
				value: 1.0
			},

			sunColor: {
				value: new THREE.Color( 0xffee00 )
			},

			bgColor: {
				value: new THREE.Color( 0x000000 )
			}

		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join( "\n" ),

		fragmentShader: [

			"varying vec2 vUv;",

			"uniform vec2 vSunPositionScreenSpace;",
			"uniform float fAspect;",

			"uniform vec3 sunColor;",
			"uniform vec3 bgColor;",

			"void main() {",

				"vec2 diff = vUv - vSunPositionScreenSpace;",

				// Correct for aspect ratio

				"diff.x *= fAspect;",

				"float prop = clamp( length( diff ) / 0.5, 0.0, 1.0 );",
				"prop = 0.35 * pow( 1.0 - prop, 3.0 );",

				"gl_FragColor.xyz = mix( sunColor, bgColor, 1.0 - prop );",
				"gl_FragColor.w = 1.0;",

			"}"

		].join( "\n" )

	}

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 */


THREE.ShaderSkin = {

	/* ------------------------------------------------------------------------------------------
	//	Simple skin shader
	//		- per-pixel Blinn-Phong diffuse term mixed with half-Lambert wrap-around term (per color component)
	//		- physically based specular term (Kelemen/Szirmay-Kalos specular reflectance)
	//
	//		- diffuse map
	//		- bump map
	//		- specular map
	//		- point, directional and hemisphere lights (use with "lights: true" material option)
	//		- fog (use with "fog: true" material option)
	//		- shadow maps
	//
	// ------------------------------------------------------------------------------------------ */

	'skinSimple' : {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "lights" ],

			{

				"enableBump": { value: 0 },
				"enableSpecular": { value: 0 },

				"tDiffuse": { value: null },
				"tBeckmann": { value: null },

				"diffuse": { value: new THREE.Color( 0xeeeeee ) },
				"specular": { value: new THREE.Color( 0x111111 ) },
				"opacity": { value: 1 },

				"uRoughness": { value: 0.15 },
				"uSpecularBrightness": { value: 0.75 },

				"bumpMap": { value: null },
				"bumpScale": { value: 1 },

				"specularMap": { value: null },

				"offsetRepeat": { value: new THREE.Vector4( 0, 0, 1, 1 ) },

				"uWrapRGB": { value: new THREE.Vector3( 0.75, 0.375, 0.1875 ) }

			}

		] ),

		fragmentShader: [

			"#define USE_BUMPMAP",

			"uniform bool enableBump;",
			"uniform bool enableSpecular;",

			"uniform vec3 diffuse;",
			"uniform vec3 specular;",
			"uniform float opacity;",

			"uniform float uRoughness;",
			"uniform float uSpecularBrightness;",

			"uniform vec3 uWrapRGB;",

			"uniform sampler2D tDiffuse;",
			"uniform sampler2D tBeckmann;",

			"uniform sampler2D specularMap;",

			"varying vec3 vNormal;",
			"varying vec2 vUv;",

			"varying vec3 vViewPosition;",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "bsdfs" ],
			THREE.ShaderChunk[ "packing" ],
			THREE.ShaderChunk[ "lights_pars" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "bumpmap_pars_fragment" ],

			// Fresnel term

			"float fresnelReflectance( vec3 H, vec3 V, float F0 ) {",

				"float base = 1.0 - dot( V, H );",
				"float exponential = pow( base, 5.0 );",

				"return exponential + F0 * ( 1.0 - exponential );",

			"}",

			// Kelemen/Szirmay-Kalos specular BRDF

			"float KS_Skin_Specular( vec3 N,", 		// Bumped surface normal
									"vec3 L,", 		// Points to light
									"vec3 V,", 		// Points to eye
									"float m,",  	// Roughness
									"float rho_s", 	// Specular brightness
									") {",

				"float result = 0.0;",
				"float ndotl = dot( N, L );",

				"if( ndotl > 0.0 ) {",

					"vec3 h = L + V;", // Unnormalized half-way vector
					"vec3 H = normalize( h );",

					"float ndoth = dot( N, H );",

					"float PH = pow( 2.0 * texture2D( tBeckmann, vec2( ndoth, m ) ).x, 10.0 );",

					"float F = fresnelReflectance( H, V, 0.028 );",
					"float frSpec = max( PH * F / dot( h, h ), 0.0 );",

					"result = ndotl * rho_s * frSpec;", // BRDF * dot(N,L) * rho_s

				"}",

				"return result;",

			"}",

			"void main() {",

				"vec3 outgoingLight = vec3( 0.0 );",	// outgoing light does not have an alpha, the surface does
				"vec4 diffuseColor = vec4( diffuse, opacity );",

				"vec4 colDiffuse = texture2D( tDiffuse, vUv );",
				"colDiffuse.rgb *= colDiffuse.rgb;",

				"diffuseColor = diffuseColor * colDiffuse;",

				"vec3 normal = normalize( vNormal );",
				"vec3 viewerDirection = normalize( vViewPosition );",

				"float specularStrength;",

				"if ( enableSpecular ) {",

					"vec4 texelSpecular = texture2D( specularMap, vUv );",
					"specularStrength = texelSpecular.r;",

				"} else {",

					"specularStrength = 1.0;",

				"}",

				"#ifdef USE_BUMPMAP",

					"if ( enableBump ) normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );",

				"#endif",

				// point lights

				"vec3 totalSpecularLight = vec3( 0.0 );",
				"vec3 totalDiffuseLight = vec3( 0.0 );",

				"#if NUM_POINT_LIGHTS > 0",

					"for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {",

						"vec3 lVector = pointLights[ i ].position + vViewPosition.xyz;",

						"float attenuation = calcLightAttenuation( length( lVector ), pointLights[ i ].distance, pointLights[ i ].decay );",

						"lVector = normalize( lVector );",

						"float pointDiffuseWeightFull = max( dot( normal, lVector ), 0.0 );",
						"float pointDiffuseWeightHalf = max( 0.5 * dot( normal, lVector ) + 0.5, 0.0 );",
						"vec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), uWrapRGB );",

						"float pointSpecularWeight = KS_Skin_Specular( normal, lVector, viewerDirection, uRoughness, uSpecularBrightness );",

						"totalDiffuseLight += pointLight[ i ].color * ( pointDiffuseWeight * attenuation );",
						"totalSpecularLight += pointLight[ i ].color * specular * ( pointSpecularWeight * specularStrength * attenuation );",

					"}",

				"#endif",

				// directional lights

				"#if NUM_DIR_LIGHTS > 0",

					"for( int i = 0; i < NUM_DIR_LIGHTS; i++ ) {",

						"vec3 dirVector = directionalLights[ i ].direction;",

						"float dirDiffuseWeightFull = max( dot( normal, dirVector ), 0.0 );",
						"float dirDiffuseWeightHalf = max( 0.5 * dot( normal, dirVector ) + 0.5, 0.0 );",
						"vec3 dirDiffuseWeight = mix( vec3 ( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), uWrapRGB );",

						"float dirSpecularWeight = KS_Skin_Specular( normal, dirVector, viewerDirection, uRoughness, uSpecularBrightness );",

						"totalDiffuseLight += directionalLights[ i ].color * dirDiffuseWeight;",
						"totalSpecularLight += directionalLights[ i ].color * ( dirSpecularWeight * specularStrength );",

					"}",

				"#endif",

				// hemisphere lights

				"#if NUM_HEMI_LIGHTS > 0",

					"for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {",

						"vec3 lVector = hemisphereLightDirection[ i ];",

						"float dotProduct = dot( normal, lVector );",
						"float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;",

						"totalDiffuseLight += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );",

						// specular (sky light)

						"float hemiSpecularWeight = 0.0;",
						"hemiSpecularWeight += KS_Skin_Specular( normal, lVector, viewerDirection, uRoughness, uSpecularBrightness );",

						// specular (ground light)

						"vec3 lVectorGround = -lVector;",
						"hemiSpecularWeight += KS_Skin_Specular( normal, lVectorGround, viewerDirection, uRoughness, uSpecularBrightness );",

						"vec3 hemiSpecularColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );",

						"totalSpecularLight += hemiSpecularColor * specular * ( hemiSpecularWeight * specularStrength );",

					"}",

				"#endif",

				"outgoingLight += diffuseColor.xyz * ( totalDiffuseLight + ambientLightColor * diffuse ) + totalSpecularLight;",

				"gl_FragColor = linearToOutputTexel( vec4( outgoingLight, diffuseColor.a ) );",	// TODO, this should be pre-multiplied to allow for bright highlights on very transparent objects

				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join( "\n" ),

		vertexShader: [

			"uniform vec4 offsetRepeat;",

			"varying vec3 vNormal;",
			"varying vec2 vUv;",

			"varying vec3 vViewPosition;",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "lights_pars" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

			"void main() {",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
				"vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",

				"vViewPosition = -mvPosition.xyz;",

				"vNormal = normalize( normalMatrix * normal );",

				"vUv = uv * offsetRepeat.zw + offsetRepeat.xy;",

				"gl_Position = projectionMatrix * mvPosition;",

				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join( "\n" )

	},

	/* ------------------------------------------------------------------------------------------
	//	Skin shader
	//		- Blinn-Phong diffuse term (using normal + diffuse maps)
	//		- subsurface scattering approximation by four blur layers
	//		- physically based specular term (Kelemen/Szirmay-Kalos specular reflectance)
	//
	//		- point and directional lights (use with "lights: true" material option)
	//
	//		- based on Nvidia Advanced Skin Rendering GDC 2007 presentation
	//		  and GPU Gems 3 Chapter 14. Advanced Techniques for Realistic Real-Time Skin Rendering
	//
	//			http://developer.download.nvidia.com/presentations/2007/gdc/Advanced_Skin.pdf
	//			http://http.developer.nvidia.com/GPUGems3/gpugems3_ch14.html
	// ------------------------------------------------------------------------------------------ */

	'skin' : {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "lights" ],

			{

				"passID": { value: 0 },

				"tDiffuse"	: { value: null },
				"tNormal"	: { value: null },

				"tBlur1"	: { value: null },
				"tBlur2"	: { value: null },
				"tBlur3"	: { value: null },
				"tBlur4"	: { value: null },

				"tBeckmann"	: { value: null },

				"uNormalScale": { value: 1.0 },

				"diffuse":  { value: new THREE.Color( 0xeeeeee ) },
				"specular": { value: new THREE.Color( 0x111111 ) },
				"opacity": 	  { value: 1 },

				"uRoughness": 	  		{ value: 0.15 },
				"uSpecularBrightness": 	{ value: 0.75 }

			}

		] ),

		fragmentShader: [

			"uniform vec3 diffuse;",
			"uniform vec3 specular;",
			"uniform float opacity;",

			"uniform float uRoughness;",
			"uniform float uSpecularBrightness;",

			"uniform int passID;",

			"uniform sampler2D tDiffuse;",
			"uniform sampler2D tNormal;",

			"uniform sampler2D tBlur1;",
			"uniform sampler2D tBlur2;",
			"uniform sampler2D tBlur3;",
			"uniform sampler2D tBlur4;",

			"uniform sampler2D tBeckmann;",

			"uniform float uNormalScale;",

			"varying vec3 vNormal;",
			"varying vec2 vUv;",

			"varying vec3 vViewPosition;",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "lights_pars" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],

			"float fresnelReflectance( vec3 H, vec3 V, float F0 ) {",

				"float base = 1.0 - dot( V, H );",
				"float exponential = pow( base, 5.0 );",

				"return exponential + F0 * ( 1.0 - exponential );",

			"}",

			// Kelemen/Szirmay-Kalos specular BRDF

			"float KS_Skin_Specular( vec3 N,", 		// Bumped surface normal
									"vec3 L,", 		// Points to light
									"vec3 V,", 		// Points to eye
									"float m,",  	// Roughness
									"float rho_s", 	// Specular brightness
									") {",

				"float result = 0.0;",
				"float ndotl = dot( N, L );",

				"if( ndotl > 0.0 ) {",

					"vec3 h = L + V;", // Unnormalized half-way vector
					"vec3 H = normalize( h );",

					"float ndoth = dot( N, H );",

					"float PH = pow( 2.0 * texture2D( tBeckmann, vec2( ndoth, m ) ).x, 10.0 );",
					"float F = fresnelReflectance( H, V, 0.028 );",
					"float frSpec = max( PH * F / dot( h, h ), 0.0 );",

					"result = ndotl * rho_s * frSpec;", // BRDF * dot(N,L) * rho_s

				"}",

				"return result;",

			"}",

			"void main() {",

				"vec3 outgoingLight = vec3( 0.0 );",	// outgoing light does not have an alpha, the surface does
				"vec4 diffuseColor = vec4( diffuse, opacity );",

				"vec4 mSpecular = vec4( specular, opacity );",

				"vec4 colDiffuse = texture2D( tDiffuse, vUv );",
				"colDiffuse *= colDiffuse;",

				"diffuseColor *= colDiffuse;",

				// normal mapping

				"vec4 posAndU = vec4( -vViewPosition, vUv.x );",
				"vec4 posAndU_dx = dFdx( posAndU ),  posAndU_dy = dFdy( posAndU );",
				"vec3 tangent = posAndU_dx.w * posAndU_dx.xyz + posAndU_dy.w * posAndU_dy.xyz;",
				"vec3 normal = normalize( vNormal );",
				"vec3 binormal = normalize( cross( tangent, normal ) );",
				"tangent = cross( normal, binormal );",	// no normalization required
				"mat3 tsb = mat3( tangent, binormal, normal );",

				"vec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;",
				"normalTex.xy *= uNormalScale;",
				"normalTex = normalize( normalTex );",

				"vec3 finalNormal = tsb * normalTex;",
				"normal = normalize( finalNormal );",

				"vec3 viewerDirection = normalize( vViewPosition );",

				// point lights

				"vec3 totalDiffuseLight = vec3( 0.0 );",
				"vec3 totalSpecularLight = vec3( 0.0 );",

				"#if NUM_POINT_LIGHTS > 0",

					"for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {",

						"vec3 pointVector = normalize( pointLights[ i ].direction );",
						"float attenuation = calcLightAttenuation( length( lVector ), pointLights[ i ].distance, pointLights[ i ].decay );",

						"float pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );",

						"totalDiffuseLight += pointLightColor[ i ] * ( pointDiffuseWeight * attenuation );",

						"if ( passID == 1 ) {",

							"float pointSpecularWeight = KS_Skin_Specular( normal, pointVector, viewerDirection, uRoughness, uSpecularBrightness );",

							"totalSpecularLight += pointLightColor[ i ] * mSpecular.xyz * ( pointSpecularWeight * attenuation );",

						"}",

					"}",

				"#endif",

				// directional lights

				"#if NUM_DIR_LIGHTS > 0",

					"for( int i = 0; i < NUM_DIR_LIGHTS; i++ ) {",

						"vec3 dirVector = directionalLights[ i ].direction;",

						"float dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );",


						"totalDiffuseLight += directionalLights[ i ].color * dirDiffuseWeight;",

						"if ( passID == 1 ) {",

							"float dirSpecularWeight = KS_Skin_Specular( normal, dirVector, viewerDirection, uRoughness, uSpecularBrightness );",

							"totalSpecularLight += directionalLights[ i ].color * mSpecular.xyz * dirSpecularWeight;",

						"}",

					"}",

				"#endif",


				"outgoingLight += diffuseColor.rgb * ( totalDiffuseLight + totalSpecularLight );",

				"if ( passID == 0 ) {",

					"outgoingLight = sqrt( outgoingLight );",

				"} else if ( passID == 1 ) {",

					//"#define VERSION1",

					"#ifdef VERSION1",

						"vec3 nonblurColor = sqrt(outgoingLight );",

					"#else",

						"vec3 nonblurColor = outgoingLight;",

					"#endif",

					"vec3 blur1Color = texture2D( tBlur1, vUv ).xyz;",
					"vec3 blur2Color = texture2D( tBlur2, vUv ).xyz;",
					"vec3 blur3Color = texture2D( tBlur3, vUv ).xyz;",
					"vec3 blur4Color = texture2D( tBlur4, vUv ).xyz;",


					//"gl_FragColor = vec4( blur1Color, gl_FragColor.w );",

					//"gl_FragColor = vec4( vec3( 0.22, 0.5, 0.7 ) * nonblurColor + vec3( 0.2, 0.5, 0.3 ) * blur1Color + vec3( 0.58, 0.0, 0.0 ) * blur2Color, gl_FragColor.w );",

					//"gl_FragColor = vec4( vec3( 0.25, 0.6, 0.8 ) * nonblurColor + vec3( 0.15, 0.25, 0.2 ) * blur1Color + vec3( 0.15, 0.15, 0.0 ) * blur2Color + vec3( 0.45, 0.0, 0.0 ) * blur3Color, gl_FragColor.w );",


					"outgoingLight = vec3( vec3( 0.22,  0.437, 0.635 ) * nonblurColor + ",
										 "vec3( 0.101, 0.355, 0.365 ) * blur1Color + ",
										 "vec3( 0.119, 0.208, 0.0 )   * blur2Color + ",
										 "vec3( 0.114, 0.0,   0.0 )   * blur3Color + ",
										 "vec3( 0.444, 0.0,   0.0 )   * blur4Color );",

					"outgoingLight *= sqrt( colDiffuse.xyz );",

					"outgoingLight += ambientLightColor * diffuse * colDiffuse.xyz + totalSpecularLight;",

					"#ifndef VERSION1",

						"outgoingLight = sqrt( outgoingLight );",

					"#endif",

				"}",

				"gl_FragColor = vec4( outgoingLight, diffuseColor.a );",	// TODO, this should be pre-multiplied to allow for bright highlights on very transparent objects

				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join( "\n" ),

		vertexShader: [

			"#ifdef VERTEX_TEXTURES",

				"uniform sampler2D tDisplacement;",
				"uniform float uDisplacementScale;",
				"uniform float uDisplacementBias;",

			"#endif",

			"varying vec3 vNormal;",
			"varying vec2 vUv;",

			"varying vec3 vViewPosition;",

			THREE.ShaderChunk[ "common" ],

			"void main() {",

				"vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				"vViewPosition = -mvPosition.xyz;",

				"vNormal = normalize( normalMatrix * normal );",

				"vUv = uv;",

				// displacement mapping

				"#ifdef VERTEX_TEXTURES",

					"vec3 dv = texture2D( tDisplacement, uv ).xyz;",
					"float df = uDisplacementScale * dv.x + uDisplacementBias;",
					"vec4 displacedPosition = vec4( vNormal.xyz * df, 0.0 ) + mvPosition;",
					"gl_Position = projectionMatrix * displacedPosition;",

				"#else",

					"gl_Position = projectionMatrix * mvPosition;",

				"#endif",

			"}"

		].join( "\n" ),

		vertexShaderUV: [

			"varying vec3 vNormal;",
			"varying vec2 vUv;",

			"varying vec3 vViewPosition;",

			THREE.ShaderChunk[ "common" ],

			"void main() {",

				"vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				"vViewPosition = -mvPosition.xyz;",

				"vNormal = normalize( normalMatrix * normal );",

				"vUv = uv;",

				"gl_Position = vec4( uv.x * 2.0 - 1.0, uv.y * 2.0 - 1.0, 0.0, 1.0 );",

			"}"

		].join( "\n" )

	},

	/* ------------------------------------------------------------------------------------------
	// Beckmann distribution function
	//	- to be used in specular term of skin shader
	//	- render a screen-aligned quad to precompute a 512 x 512 texture
	//
	//		- from http://developer.nvidia.com/node/171
	 ------------------------------------------------------------------------------------------ */

	"beckmann" : {

		uniforms: {},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join( "\n" ),

		fragmentShader: [

			"varying vec2 vUv;",

			"float PHBeckmann( float ndoth, float m ) {",

				"float alpha = acos( ndoth );",
				"float ta = tan( alpha );",

				"float val = 1.0 / ( m * m * pow( ndoth, 4.0 ) ) * exp( -( ta * ta ) / ( m * m ) );",
				"return val;",

			"}",

			"float KSTextureCompute( vec2 tex ) {",

				// Scale the value to fit within [0,1]  invert upon lookup.

				"return 0.5 * pow( PHBeckmann( tex.x, tex.y ), 0.1 );",

			"}",

			"void main() {",

				"float x = KSTextureCompute( vUv );",

				"gl_FragColor = vec4( x, x, x, 1.0 );",

			"}"

		].join( "\n" )

	}

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 */

THREE.ShaderTerrain = {

	/* -------------------------------------------------------------------------
	//	Dynamic terrain shader
	//		- Blinn-Phong
	//		- height + normal + diffuse1 + diffuse2 + specular + detail maps
	//		- point, directional and hemisphere lights (use with "lights: true" material option)
	//		- shadow maps receiving
	 ------------------------------------------------------------------------- */

	'terrain' : {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "lights" ],

			{

				"enableDiffuse1": { value: 0 },
				"enableDiffuse2": { value: 0 },
				"enableSpecular": { value: 0 },
				"enableReflection": { value: 0 },

				"tDiffuse1": { value: null },
				"tDiffuse2": { value: null },
				"tDetail": { value: null },
				"tNormal": { value: null },
				"tSpecular": { value: null },
				"tDisplacement": { value: null },

				"uNormalScale": { value: 1.0 },

				"uDisplacementBias": { value: 0.0 },
				"uDisplacementScale": { value: 1.0 },

				"diffuse": { value: new THREE.Color( 0xeeeeee ) },
				"specular": { value: new THREE.Color( 0x111111 ) },
				"shininess": { value: 30 },
				"opacity": { value: 1 },

				"uRepeatBase": { value: new THREE.Vector2( 1, 1 ) },
				"uRepeatOverlay": { value: new THREE.Vector2( 1, 1 ) },

				"uOffset": { value: new THREE.Vector2( 0, 0 ) }

			}

		] ),

		fragmentShader: [

			"uniform vec3 diffuse;",
			"uniform vec3 specular;",
			"uniform float shininess;",
			"uniform float opacity;",

			"uniform bool enableDiffuse1;",
			"uniform bool enableDiffuse2;",
			"uniform bool enableSpecular;",

			"uniform sampler2D tDiffuse1;",
			"uniform sampler2D tDiffuse2;",
			"uniform sampler2D tDetail;",
			"uniform sampler2D tNormal;",
			"uniform sampler2D tSpecular;",
			"uniform sampler2D tDisplacement;",

			"uniform float uNormalScale;",

			"uniform vec2 uRepeatOverlay;",
			"uniform vec2 uRepeatBase;",

			"uniform vec2 uOffset;",

			"varying vec3 vTangent;",
			"varying vec3 vBinormal;",
			"varying vec3 vNormal;",
			"varying vec2 vUv;",

			"varying vec3 vViewPosition;",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "bsdfs" ],
			THREE.ShaderChunk[ "lights_pars" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],

			"float calcLightAttenuation( float lightDistance, float cutoffDistance, float decayExponent ) {",
 				"if ( decayExponent > 0.0 ) {",
 					"return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );",
 				"}",
 				"return 1.0;",
 			"}",

			"void main() {",

				"vec3 outgoingLight = vec3( 0.0 );",	// outgoing light does not have an alpha, the surface does
				"vec4 diffuseColor = vec4( diffuse, opacity );",

				"vec3 specularTex = vec3( 1.0 );",

				"vec2 uvOverlay = uRepeatOverlay * vUv + uOffset;",
				"vec2 uvBase = uRepeatBase * vUv;",

				"vec3 normalTex = texture2D( tDetail, uvOverlay ).xyz * 2.0 - 1.0;",
				"normalTex.xy *= uNormalScale;",
				"normalTex = normalize( normalTex );",

				"if( enableDiffuse1 && enableDiffuse2 ) {",

					"vec4 colDiffuse1 = texture2D( tDiffuse1, uvOverlay );",
					"vec4 colDiffuse2 = texture2D( tDiffuse2, uvOverlay );",

					"colDiffuse1 = GammaToLinear( colDiffuse1, float( GAMMA_FACTOR ) );",
					"colDiffuse2 = GammaToLinear( colDiffuse2, float( GAMMA_FACTOR ) );",

					"diffuseColor *= mix ( colDiffuse1, colDiffuse2, 1.0 - texture2D( tDisplacement, uvBase ) );",

				" } else if( enableDiffuse1 ) {",

					"diffuseColor *= texture2D( tDiffuse1, uvOverlay );",

				"} else if( enableDiffuse2 ) {",

					"diffuseColor *= texture2D( tDiffuse2, uvOverlay );",

				"}",

				"if( enableSpecular )",
					"specularTex = texture2D( tSpecular, uvOverlay ).xyz;",

				"mat3 tsb = mat3( vTangent, vBinormal, vNormal );",
				"vec3 finalNormal = tsb * normalTex;",

				"vec3 normal = normalize( finalNormal );",
				"vec3 viewPosition = normalize( vViewPosition );",

				"vec3 totalDiffuseLight = vec3( 0.0 );",
				"vec3 totalSpecularLight = vec3( 0.0 );",

				// point lights

				"#if NUM_POINT_LIGHTS > 0",

					"for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {",

						"vec3 lVector = pointLights[ i ].position + vViewPosition.xyz;",

						"float attenuation = calcLightAttenuation( length( lVector ), pointLights[ i ].distance, pointLights[ i ].decay );",

						"lVector = normalize( lVector );",

						"vec3 pointHalfVector = normalize( lVector + viewPosition );",

						"float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );",
						"float pointDiffuseWeight = max( dot( normal, lVector ), 0.0 );",

						"float pointSpecularWeight = specularTex.r * max( pow( pointDotNormalHalf, shininess ), 0.0 );",

						"totalDiffuseLight += attenuation * pointLights[ i ].color * pointDiffuseWeight;",
						"totalSpecularLight += attenuation * pointLights[ i ].color * specular * pointSpecularWeight * pointDiffuseWeight;",

					"}",

				"#endif",

				// directional lights

				"#if NUM_DIR_LIGHTS > 0",

					"vec3 dirDiffuse = vec3( 0.0 );",
					"vec3 dirSpecular = vec3( 0.0 );",

					"for( int i = 0; i < NUM_DIR_LIGHTS; i++ ) {",

						"vec3 dirVector = directionalLights[ i ].direction;",
						"vec3 dirHalfVector = normalize( dirVector + viewPosition );",

						"float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );",
						"float dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );",

						"float dirSpecularWeight = specularTex.r * max( pow( dirDotNormalHalf, shininess ), 0.0 );",

						"totalDiffuseLight += directionalLights[ i ].color * dirDiffuseWeight;",
						"totalSpecularLight += directionalLights[ i ].color * specular * dirSpecularWeight * dirDiffuseWeight;",

					"}",

				"#endif",

				// hemisphere lights

				"#if NUM_HEMI_LIGHTS > 0",

					"vec3 hemiDiffuse  = vec3( 0.0 );",
					"vec3 hemiSpecular = vec3( 0.0 );",

					"for( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {",

						"vec3 lVector = hemisphereLightDirection[ i ];",

						// diffuse

						"float dotProduct = dot( normal, lVector );",
						"float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;",

						"totalDiffuseLight += mix( hemisphereLights[ i ].groundColor, hemisphereLights[ i ].skyColor, hemiDiffuseWeight );",

						// specular (sky light)

						"float hemiSpecularWeight = 0.0;",

						"vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );",
						"float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;",
						"hemiSpecularWeight += specularTex.r * max( pow( hemiDotNormalHalfSky, shininess ), 0.0 );",

						// specular (ground light)

						"vec3 lVectorGround = -lVector;",

						"vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );",
						"float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;",
						"hemiSpecularWeight += specularTex.r * max( pow( hemiDotNormalHalfGround, shininess ), 0.0 );",

						"totalSpecularLight += specular * mix( hemisphereLights[ i ].groundColor, hemisphereLights[ i ].skyColor, hemiDiffuseWeight ) * hemiSpecularWeight * hemiDiffuseWeight;",

					"}",

				"#endif",

				"outgoingLight += diffuseColor.xyz * ( totalDiffuseLight + ambientLightColor + totalSpecularLight );",

				THREE.ShaderChunk[ "fog_fragment" ],

				"gl_FragColor = vec4( outgoingLight, diffuseColor.a );",	// TODO, this should be pre-multiplied to allow for bright highlights on very transparent objects

			"}"

		].join( "\n" ),

		vertexShader: [

			"attribute vec4 tangent;",

			"uniform vec2 uRepeatBase;",

			"uniform sampler2D tNormal;",

			"#ifdef VERTEX_TEXTURES",

				"uniform sampler2D tDisplacement;",
				"uniform float uDisplacementScale;",
				"uniform float uDisplacementBias;",

			"#endif",

			"varying vec3 vTangent;",
			"varying vec3 vBinormal;",
			"varying vec3 vNormal;",
			"varying vec2 vUv;",

			"varying vec3 vViewPosition;",

			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

			"void main() {",

				"vNormal = normalize( normalMatrix * normal );",

				// tangent and binormal vectors

				"vTangent = normalize( normalMatrix * tangent.xyz );",

				"vBinormal = cross( vNormal, vTangent ) * tangent.w;",
				"vBinormal = normalize( vBinormal );",

				// texture coordinates

				"vUv = uv;",

				"vec2 uvBase = uv * uRepeatBase;",

				// displacement mapping

				"#ifdef VERTEX_TEXTURES",

					"vec3 dv = texture2D( tDisplacement, uvBase ).xyz;",
					"float df = uDisplacementScale * dv.x + uDisplacementBias;",
					"vec3 displacedPosition = normal * df + position;",

					"vec4 worldPosition = modelMatrix * vec4( displacedPosition, 1.0 );",
					"vec4 mvPosition = modelViewMatrix * vec4( displacedPosition, 1.0 );",

				"#else",

					"vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
					"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				"#endif",

				"gl_Position = projectionMatrix * mvPosition;",

				"vViewPosition = -mvPosition.xyz;",

				"vec3 normalTex = texture2D( tNormal, uvBase ).xyz * 2.0 - 1.0;",
				"vNormal = normalMatrix * normalTex;",

				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join( "\n" )

	}

};

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * ShaderToon currently contains:
 *
 *	toon1
 *	toon2
 *	hatching
 *	dotted
 */

THREE.ShaderToon = {

	'toon1' : {

		uniforms: {

			"uDirLightPos": { value: new THREE.Vector3() },
			"uDirLightColor": { value: new THREE.Color( 0xeeeeee ) },

			"uAmbientLightColor": { value: new THREE.Color( 0x050505 ) },

			"uBaseColor": { value: new THREE.Color( 0xffffff ) }

		},

		vertexShader: [

			"varying vec3 vNormal;",
			"varying vec3 vRefract;",

			"void main() {",

				"vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
				"vec3 worldNormal = normalize ( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );",

				"vNormal = normalize( normalMatrix * normal );",

				"vec3 I = worldPosition.xyz - cameraPosition;",
				"vRefract = refract( normalize( I ), worldNormal, 1.02 );",

				"gl_Position = projectionMatrix * mvPosition;",

			"}"

		].join( "\n" ),

		fragmentShader: [

			"uniform vec3 uBaseColor;",

			"uniform vec3 uDirLightPos;",
			"uniform vec3 uDirLightColor;",

			"uniform vec3 uAmbientLightColor;",

			"varying vec3 vNormal;",

			"varying vec3 vRefract;",

			"void main() {",

				"float directionalLightWeighting = max( dot( normalize( vNormal ), uDirLightPos ), 0.0);",
				"vec3 lightWeighting = uAmbientLightColor + uDirLightColor * directionalLightWeighting;",

				"float intensity = smoothstep( - 0.5, 1.0, pow( length(lightWeighting), 20.0 ) );",
				"intensity += length(lightWeighting) * 0.2;",

				"float cameraWeighting = dot( normalize( vNormal ), vRefract );",
				"intensity += pow( 1.0 - length( cameraWeighting ), 6.0 );",
				"intensity = intensity * 0.2 + 0.3;",

				"if ( intensity < 0.50 ) {",

					"gl_FragColor = vec4( 2.0 * intensity * uBaseColor, 1.0 );",

				"} else {",

					"gl_FragColor = vec4( 1.0 - 2.0 * ( 1.0 - intensity ) * ( 1.0 - uBaseColor ), 1.0 );",

				"}",

			"}"

		].join( "\n" )

	},

	'toon2' : {

		uniforms: {

			"uDirLightPos": { value: new THREE.Vector3() },
			"uDirLightColor": { value: new THREE.Color( 0xeeeeee ) },

			"uAmbientLightColor": { value: new THREE.Color( 0x050505 ) },

			"uBaseColor": { value: new THREE.Color( 0xeeeeee ) },
			"uLineColor1": { value: new THREE.Color( 0x808080 ) },
			"uLineColor2": { value: new THREE.Color( 0x000000 ) },
			"uLineColor3": { value: new THREE.Color( 0x000000 ) },
			"uLineColor4": { value: new THREE.Color( 0x000000 ) }

		},

		vertexShader: [

			"varying vec3 vNormal;",

			"void main() {",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"vNormal = normalize( normalMatrix * normal );",

			"}"

		].join( "\n" ),

		fragmentShader: [

			"uniform vec3 uBaseColor;",
			"uniform vec3 uLineColor1;",
			"uniform vec3 uLineColor2;",
			"uniform vec3 uLineColor3;",
			"uniform vec3 uLineColor4;",

			"uniform vec3 uDirLightPos;",
			"uniform vec3 uDirLightColor;",

			"uniform vec3 uAmbientLightColor;",

			"varying vec3 vNormal;",

			"void main() {",

				"float camera = max( dot( normalize( vNormal ), vec3( 0.0, 0.0, 1.0 ) ), 0.4);",
				"float light = max( dot( normalize( vNormal ), uDirLightPos ), 0.0);",

				"gl_FragColor = vec4( uBaseColor, 1.0 );",

				"if ( length(uAmbientLightColor + uDirLightColor * light) < 1.00 ) {",

					"gl_FragColor *= vec4( uLineColor1, 1.0 );",

				"}",

				"if ( length(uAmbientLightColor + uDirLightColor * camera) < 0.50 ) {",

					"gl_FragColor *= vec4( uLineColor2, 1.0 );",

				"}",

			"}"

		].join( "\n" )

	},

	'hatching' : {

		uniforms: {

			"uDirLightPos":	{ value: new THREE.Vector3() },
			"uDirLightColor": { value: new THREE.Color( 0xeeeeee ) },

			"uAmbientLightColor": { value: new THREE.Color( 0x050505 ) },

			"uBaseColor":  { value: new THREE.Color( 0xffffff ) },
			"uLineColor1": { value: new THREE.Color( 0x000000 ) },
			"uLineColor2": { value: new THREE.Color( 0x000000 ) },
			"uLineColor3": { value: new THREE.Color( 0x000000 ) },
			"uLineColor4": { value: new THREE.Color( 0x000000 ) }

		},

		vertexShader: [

			"varying vec3 vNormal;",

			"void main() {",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"vNormal = normalize( normalMatrix * normal );",

			"}"

		].join( "\n" ),

		fragmentShader: [

			"uniform vec3 uBaseColor;",
			"uniform vec3 uLineColor1;",
			"uniform vec3 uLineColor2;",
			"uniform vec3 uLineColor3;",
			"uniform vec3 uLineColor4;",

			"uniform vec3 uDirLightPos;",
			"uniform vec3 uDirLightColor;",

			"uniform vec3 uAmbientLightColor;",

			"varying vec3 vNormal;",

			"void main() {",

				"float directionalLightWeighting = max( dot( normalize(vNormal), uDirLightPos ), 0.0);",
				"vec3 lightWeighting = uAmbientLightColor + uDirLightColor * directionalLightWeighting;",

				"gl_FragColor = vec4( uBaseColor, 1.0 );",

				"if ( length(lightWeighting) < 1.00 ) {",

					"if ( mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) {",

						"gl_FragColor = vec4( uLineColor1, 1.0 );",

					"}",

				"}",

				"if ( length(lightWeighting) < 0.75 ) {",

					"if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0) {",

						"gl_FragColor = vec4( uLineColor2, 1.0 );",

					"}",
				"}",

				"if ( length(lightWeighting) < 0.50 ) {",

					"if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0) {",

						"gl_FragColor = vec4( uLineColor3, 1.0 );",

					"}",
				"}",

				"if ( length(lightWeighting) < 0.3465 ) {",

					"if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0) {",

						"gl_FragColor = vec4( uLineColor4, 1.0 );",

					"}",
				"}",

			"}"

		].join( "\n" )

	},

	'dotted' : {

		uniforms: {

			"uDirLightPos":	{ value: new THREE.Vector3() },
			"uDirLightColor": { value: new THREE.Color( 0xeeeeee ) },

			"uAmbientLightColor": { value: new THREE.Color( 0x050505 ) },

			"uBaseColor":  { value: new THREE.Color( 0xffffff ) },
			"uLineColor1": { value: new THREE.Color( 0x000000 ) }

		},

		vertexShader: [

			"varying vec3 vNormal;",

			"void main() {",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"vNormal = normalize( normalMatrix * normal );",

			"}"

		].join( "\n" ),

		fragmentShader: [

			"uniform vec3 uBaseColor;",
			"uniform vec3 uLineColor1;",
			"uniform vec3 uLineColor2;",
			"uniform vec3 uLineColor3;",
			"uniform vec3 uLineColor4;",

			"uniform vec3 uDirLightPos;",
			"uniform vec3 uDirLightColor;",

			"uniform vec3 uAmbientLightColor;",

			"varying vec3 vNormal;",

			"void main() {",

				"float directionalLightWeighting = max( dot( normalize(vNormal), uDirLightPos ), 0.0);",
				"vec3 lightWeighting = uAmbientLightColor + uDirLightColor * directionalLightWeighting;",

				"gl_FragColor = vec4( uBaseColor, 1.0 );",

				"if ( length(lightWeighting) < 1.00 ) {",

					"if ( ( mod(gl_FragCoord.x, 4.001) + mod(gl_FragCoord.y, 4.0) ) > 6.00 ) {",

						"gl_FragColor = vec4( uLineColor1, 1.0 );",

					"}",

				"}",

				"if ( length(lightWeighting) < 0.50 ) {",

					"if ( ( mod(gl_FragCoord.x + 2.0, 4.001) + mod(gl_FragCoord.y + 2.0, 4.0) ) > 6.00 ) {",

						"gl_FragColor = vec4( uLineColor1, 1.0 );",

					"}",

				"}",

			"}"

		].join( "\n" )

	}

};

// Ported from Stefan Gustavson's java implementation
// http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
// Read Stefan's excellent paper for details on how this code works.
//
// Sean McCullough banksean@gmail.com
//
// Added 4D noise
// Joshua Koo zz85nus@gmail.com 

/**
 * You can pass in a random number generator object if you like.
 * It is assumed to have a random() method.
 */
var SimplexNoise = function(r) {
	if (r == undefined) r = Math;
	this.grad3 = [[ 1,1,0 ],[ -1,1,0 ],[ 1,-1,0 ],[ -1,-1,0 ], 
                                 [ 1,0,1 ],[ -1,0,1 ],[ 1,0,-1 ],[ -1,0,-1 ], 
                                 [ 0,1,1 ],[ 0,-1,1 ],[ 0,1,-1 ],[ 0,-1,-1 ]]; 

	this.grad4 = [[ 0,1,1,1 ], [ 0,1,1,-1 ], [ 0,1,-1,1 ], [ 0,1,-1,-1 ],
	     [ 0,-1,1,1 ], [ 0,-1,1,-1 ], [ 0,-1,-1,1 ], [ 0,-1,-1,-1 ],
	     [ 1,0,1,1 ], [ 1,0,1,-1 ], [ 1,0,-1,1 ], [ 1,0,-1,-1 ],
	     [ -1,0,1,1 ], [ -1,0,1,-1 ], [ -1,0,-1,1 ], [ -1,0,-1,-1 ],
	     [ 1,1,0,1 ], [ 1,1,0,-1 ], [ 1,-1,0,1 ], [ 1,-1,0,-1 ],
	     [ -1,1,0,1 ], [ -1,1,0,-1 ], [ -1,-1,0,1 ], [ -1,-1,0,-1 ],
	     [ 1,1,1,0 ], [ 1,1,-1,0 ], [ 1,-1,1,0 ], [ 1,-1,-1,0 ],
	     [ -1,1,1,0 ], [ -1,1,-1,0 ], [ -1,-1,1,0 ], [ -1,-1,-1,0 ]];

	this.p = [];
	for (var i = 0; i < 256; i ++) {
		this.p[i] = Math.floor(r.random() * 256);
	}
  // To remove the need for index wrapping, double the permutation table length 
	this.perm = []; 
	for (var i = 0; i < 512; i ++) {
		this.perm[i] = this.p[i & 255];
	} 

  // A lookup table to traverse the simplex around a given point in 4D. 
  // Details can be found where this table is used, in the 4D noise method. 
	this.simplex = [ 
    [ 0,1,2,3 ],[ 0,1,3,2 ],[ 0,0,0,0 ],[ 0,2,3,1 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 1,2,3,0 ], 
    [ 0,2,1,3 ],[ 0,0,0,0 ],[ 0,3,1,2 ],[ 0,3,2,1 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 1,3,2,0 ], 
    [ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ], 
    [ 1,2,0,3 ],[ 0,0,0,0 ],[ 1,3,0,2 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 2,3,0,1 ],[ 2,3,1,0 ], 
    [ 1,0,2,3 ],[ 1,0,3,2 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 2,0,3,1 ],[ 0,0,0,0 ],[ 2,1,3,0 ], 
    [ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ], 
    [ 2,0,1,3 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 3,0,1,2 ],[ 3,0,2,1 ],[ 0,0,0,0 ],[ 3,1,2,0 ], 
    [ 2,1,0,3 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 0,0,0,0 ],[ 3,1,0,2 ],[ 0,0,0,0 ],[ 3,2,0,1 ],[ 3,2,1,0 ]]; 
};

SimplexNoise.prototype.dot = function(g, x, y) { 
	return g[0] * x + g[1] * y;
};

SimplexNoise.prototype.dot3 = function(g, x, y, z) {
	return g[0] * x + g[1] * y + g[2] * z; 
};

SimplexNoise.prototype.dot4 = function(g, x, y, z, w) {
	return g[0] * x + g[1] * y + g[2] * z + g[3] * w;
};

SimplexNoise.prototype.noise = function(xin, yin) { 
	var n0, n1, n2; // Noise contributions from the three corners 
  // Skew the input space to determine which simplex cell we're in 
	var F2 = 0.5 * (Math.sqrt(3.0) - 1.0); 
	var s = (xin + yin) * F2; // Hairy factor for 2D 
	var i = Math.floor(xin + s); 
	var j = Math.floor(yin + s); 
	var G2 = (3.0 - Math.sqrt(3.0)) / 6.0; 
	var t = (i + j) * G2; 
	var X0 = i - t; // Unskew the cell origin back to (x,y) space 
	var Y0 = j - t; 
	var x0 = xin - X0; // The x,y distances from the cell origin 
	var y0 = yin - Y0; 
  // For the 2D case, the simplex shape is an equilateral triangle. 
  // Determine which simplex we are in. 
	var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords 
	if (x0 > y0) {i1 = 1; j1 = 0;} // lower triangle, XY order: (0,0)->(1,0)->(1,1) 
	else {i1 = 0; j1 = 1;}      // upper triangle, YX order: (0,0)->(0,1)->(1,1) 
  // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and 
  // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where 
  // c = (3-sqrt(3))/6 
	var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords 
	var y1 = y0 - j1 + G2; 
	var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords 
	var y2 = y0 - 1.0 + 2.0 * G2; 
  // Work out the hashed gradient indices of the three simplex corners 
	var ii = i & 255; 
	var jj = j & 255; 
	var gi0 = this.perm[ii + this.perm[jj]] % 12; 
	var gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12; 
	var gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12; 
  // Calculate the contribution from the three corners 
	var t0 = 0.5 - x0 * x0 - y0 * y0; 
	if (t0 < 0) n0 = 0.0; 
	else { 
		t0 *= t0; 
		n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);  // (x,y) of grad3 used for 2D gradient 
	} 
	var t1 = 0.5 - x1 * x1 - y1 * y1; 
	if (t1 < 0) n1 = 0.0; 
	else { 
		t1 *= t1; 
		n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1); 
	}
	var t2 = 0.5 - x2 * x2 - y2 * y2; 
	if (t2 < 0) n2 = 0.0; 
	else { 
		t2 *= t2; 
		n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2); 
	} 
  // Add contributions from each corner to get the final noise value. 
  // The result is scaled to return values in the interval [-1,1]. 
	return 70.0 * (n0 + n1 + n2); 
};

// 3D simplex noise 
SimplexNoise.prototype.noise3d = function(xin, yin, zin) { 
	var n0, n1, n2, n3; // Noise contributions from the four corners 
  // Skew the input space to determine which simplex cell we're in 
	var F3 = 1.0 / 3.0; 
	var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D 
	var i = Math.floor(xin + s); 
	var j = Math.floor(yin + s); 
	var k = Math.floor(zin + s); 
	var G3 = 1.0 / 6.0; // Very nice and simple unskew factor, too 
	var t = (i + j + k) * G3; 
	var X0 = i - t; // Unskew the cell origin back to (x,y,z) space 
	var Y0 = j - t; 
	var Z0 = k - t; 
	var x0 = xin - X0; // The x,y,z distances from the cell origin 
	var y0 = yin - Y0; 
	var z0 = zin - Z0; 
  // For the 3D case, the simplex shape is a slightly irregular tetrahedron. 
  // Determine which simplex we are in. 
	var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords 
	var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords 
	if (x0 >= y0) { 
		if (y0 >= z0) 
      { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; } // X Y Z order 
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; } // X Z Y order 
		else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; } // Z X Y order 
	} 
	else { // x0<y0 
		if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; } // Z Y X order 
    else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; } // Y Z X order 
		else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; } // Y X Z order 
	} 
  // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z), 
  // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and 
  // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where 
  // c = 1/6.
	var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords 
	var y1 = y0 - j1 + G3; 
	var z1 = z0 - k1 + G3; 
	var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords 
	var y2 = y0 - j2 + 2.0 * G3; 
	var z2 = z0 - k2 + 2.0 * G3; 
	var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords 
	var y3 = y0 - 1.0 + 3.0 * G3; 
	var z3 = z0 - 1.0 + 3.0 * G3; 
  // Work out the hashed gradient indices of the four simplex corners 
	var ii = i & 255; 
	var jj = j & 255; 
	var kk = k & 255; 
	var gi0 = this.perm[ii + this.perm[jj + this.perm[kk]]] % 12; 
	var gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12; 
	var gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12; 
	var gi3 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12; 
  // Calculate the contribution from the four corners 
	var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0; 
	if (t0 < 0) n0 = 0.0; 
	else { 
		t0 *= t0; 
		n0 = t0 * t0 * this.dot3(this.grad3[gi0], x0, y0, z0); 
	}
	var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1; 
	if (t1 < 0) n1 = 0.0; 
	else { 
		t1 *= t1; 
		n1 = t1 * t1 * this.dot3(this.grad3[gi1], x1, y1, z1); 
	} 
	var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2; 
	if (t2 < 0) n2 = 0.0; 
	else { 
		t2 *= t2; 
		n2 = t2 * t2 * this.dot3(this.grad3[gi2], x2, y2, z2); 
	} 
	var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3; 
	if (t3 < 0) n3 = 0.0; 
	else { 
		t3 *= t3; 
		n3 = t3 * t3 * this.dot3(this.grad3[gi3], x3, y3, z3); 
	} 
  // Add contributions from each corner to get the final noise value. 
  // The result is scaled to stay just inside [-1,1] 
	return 32.0 * (n0 + n1 + n2 + n3); 
};

// 4D simplex noise
SimplexNoise.prototype.noise4d = function( x, y, z, w ) {
	// For faster and easier lookups
	var grad4 = this.grad4;
	var simplex = this.simplex;
	var perm = this.perm;
	
   // The skewing and unskewing factors are hairy again for the 4D case
	var F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
	var G4 = (5.0 - Math.sqrt(5.0)) / 20.0;
	var n0, n1, n2, n3, n4; // Noise contributions from the five corners
   // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
	var s = (x + y + z + w) * F4; // Factor for 4D skewing
	var i = Math.floor(x + s);
	var j = Math.floor(y + s);
	var k = Math.floor(z + s);
	var l = Math.floor(w + s);
	var t = (i + j + k + l) * G4; // Factor for 4D unskewing
	var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
	var Y0 = j - t;
	var Z0 = k - t;
	var W0 = l - t;
	var x0 = x - X0;  // The x,y,z,w distances from the cell origin
	var y0 = y - Y0;
	var z0 = z - Z0;
	var w0 = w - W0;

   // For the 4D case, the simplex is a 4D shape I won't even try to describe.
   // To find out which of the 24 possible simplices we're in, we need to
   // determine the magnitude ordering of x0, y0, z0 and w0.
   // The method below is a good way of finding the ordering of x,y,z,w and
   // then find the correct traversal order for the simplex we’re in.
   // First, six pair-wise comparisons are performed between each possible pair
   // of the four coordinates, and the results are used to add up binary bits
   // for an integer index.
	var c1 = (x0 > y0) ? 32 : 0;
	var c2 = (x0 > z0) ? 16 : 0;
	var c3 = (y0 > z0) ? 8 : 0;
	var c4 = (x0 > w0) ? 4 : 0;
	var c5 = (y0 > w0) ? 2 : 0;
	var c6 = (z0 > w0) ? 1 : 0;
	var c = c1 + c2 + c3 + c4 + c5 + c6;
	var i1, j1, k1, l1; // The integer offsets for the second simplex corner
	var i2, j2, k2, l2; // The integer offsets for the third simplex corner
	var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner
   // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
   // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
   // impossible. Only the 24 indices which have non-zero entries make any sense.
   // We use a thresholding to set the coordinates in turn from the largest magnitude.
   // The number 3 in the "simplex" array is at the position of the largest coordinate.
	i1 = simplex[c][0] >= 3 ? 1 : 0;
	j1 = simplex[c][1] >= 3 ? 1 : 0;
	k1 = simplex[c][2] >= 3 ? 1 : 0;
	l1 = simplex[c][3] >= 3 ? 1 : 0;
   // The number 2 in the "simplex" array is at the second largest coordinate.
	i2 = simplex[c][0] >= 2 ? 1 : 0;
	j2 = simplex[c][1] >= 2 ? 1 : 0;    k2 = simplex[c][2] >= 2 ? 1 : 0;
	l2 = simplex[c][3] >= 2 ? 1 : 0;
   // The number 1 in the "simplex" array is at the second smallest coordinate.
	i3 = simplex[c][0] >= 1 ? 1 : 0;
	j3 = simplex[c][1] >= 1 ? 1 : 0;
	k3 = simplex[c][2] >= 1 ? 1 : 0;
	l3 = simplex[c][3] >= 1 ? 1 : 0;
   // The fifth corner has all coordinate offsets = 1, so no need to look that up.
	var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
	var y1 = y0 - j1 + G4;
	var z1 = z0 - k1 + G4;
	var w1 = w0 - l1 + G4;
	var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords
	var y2 = y0 - j2 + 2.0 * G4;
	var z2 = z0 - k2 + 2.0 * G4;
	var w2 = w0 - l2 + 2.0 * G4;
	var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords
	var y3 = y0 - j3 + 3.0 * G4;
	var z3 = z0 - k3 + 3.0 * G4;
	var w3 = w0 - l3 + 3.0 * G4;
	var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords
	var y4 = y0 - 1.0 + 4.0 * G4;
	var z4 = z0 - 1.0 + 4.0 * G4;
	var w4 = w0 - 1.0 + 4.0 * G4;
   // Work out the hashed gradient indices of the five simplex corners
	var ii = i & 255;
	var jj = j & 255;
	var kk = k & 255;
	var ll = l & 255;
	var gi0 = perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32;
	var gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32;
	var gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32;
	var gi3 = perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32;
	var gi4 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32;
   // Calculate the contribution from the five corners
	var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
	if (t0 < 0) n0 = 0.0;
	else {
		t0 *= t0;
		n0 = t0 * t0 * this.dot4(grad4[gi0], x0, y0, z0, w0);
	}
	var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
	if (t1 < 0) n1 = 0.0;
	else {
		t1 *= t1;
		n1 = t1 * t1 * this.dot4(grad4[gi1], x1, y1, z1, w1);
	}
	var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
	if (t2 < 0) n2 = 0.0;
	else {
		t2 *= t2;
		n2 = t2 * t2 * this.dot4(grad4[gi2], x2, y2, z2, w2);
	}   var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
	if (t3 < 0) n3 = 0.0;
	else {
		t3 *= t3;
		n3 = t3 * t3 * this.dot4(grad4[gi3], x3, y3, z3, w3);
	}
	var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
	if (t4 < 0) n4 = 0.0;
	else {
		t4 *= t4;
		n4 = t4 * t4 * this.dot4(grad4[gi4], x4, y4, z4, w4);
	}
   // Sum up and scale the result to cover the range [-1,1]
	return 27.0 * (n0 + n1 + n2 + n3 + n4);
};

/**
 * @author zz85 / https://github.com/zz85
 *
 * Based on "A Practical Analytic Model for Daylight"
 * aka The Preetham Model, the de facto standard analytic skydome model
 * http://www.cs.utah.edu/~shirley/papers/sunsky/sunsky.pdf
 *
 * First implemented by Simon Wallner
 * http://www.simonwallner.at/projects/atmospheric-scattering
 *
 * Improved by Martin Upitis
 * http://blenderartists.org/forum/showthread.php?245954-preethams-sky-impementation-HDR
 *
 * Three.js integration by zz85 http://twitter.com/blurspline
*/

THREE.ShaderLib[ 'sky' ] = {

	uniforms: {

		luminance: { value: 1 },
		turbidity: { value: 2 },
		reileigh: { value: 1 },
		mieCoefficient: { value: 0.005 },
		mieDirectionalG: { value: 0.8 },
		sunPosition: { value: new THREE.Vector3() }

	},

	vertexShader: [

		"varying vec3 vWorldPosition;",

		"void main() {",

			"vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
			"vWorldPosition = worldPosition.xyz;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}",

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D skySampler;",
		"uniform vec3 sunPosition;",
		"varying vec3 vWorldPosition;",

		"vec3 cameraPos = vec3(0., 0., 0.);",
		"// uniform sampler2D sDiffuse;",
		"// const float turbidity = 10.0; //",
		"// const float reileigh = 2.; //",
		"// const float luminance = 1.0; //",
		"// const float mieCoefficient = 0.005;",
		"// const float mieDirectionalG = 0.8;",

		"uniform float luminance;",
		"uniform float turbidity;",
		"uniform float reileigh;",
		"uniform float mieCoefficient;",
		"uniform float mieDirectionalG;",

		"// constants for atmospheric scattering",
		"const float e = 2.71828182845904523536028747135266249775724709369995957;",
		"const float pi = 3.141592653589793238462643383279502884197169;",

		"const float n = 1.0003; // refractive index of air",
		"const float N = 2.545E25; // number of molecules per unit volume for air at",
								"// 288.15K and 1013mb (sea level -45 celsius)",
		"const float pn = 0.035;	// depolatization factor for standard air",

		"// wavelength of used primaries, according to preetham",
		"const vec3 lambda = vec3(680E-9, 550E-9, 450E-9);",

		"// mie stuff",
		"// K coefficient for the primaries",
		"const vec3 K = vec3(0.686, 0.678, 0.666);",
		"const float v = 4.0;",

		"// optical length at zenith for molecules",
		"const float rayleighZenithLength = 8.4E3;",
		"const float mieZenithLength = 1.25E3;",
		"const vec3 up = vec3(0.0, 1.0, 0.0);",

		"const float EE = 1000.0;",
		"const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;",
		"// 66 arc seconds -> degrees, and the cosine of that",

		"// earth shadow hack",
		"const float cutoffAngle = pi/1.95;",
		"const float steepness = 1.5;",


		"vec3 totalRayleigh(vec3 lambda)",
		"{",
			"return (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn));",
		"}",

		// see http://blenderartists.org/forum/showthread.php?321110-Shaders-and-Skybox-madness
		"// A simplied version of the total Reayleigh scattering to works on browsers that use ANGLE",
		"vec3 simplifiedRayleigh()",
		"{",
			"return 0.0005 / vec3(94, 40, 18);",
			// return 0.00054532832366 / (3.0 * 2.545E25 * pow(vec3(680E-9, 550E-9, 450E-9), vec3(4.0)) * 6.245);
		"}",

		"float rayleighPhase(float cosTheta)",
		"{	 ",
			"return (3.0 / (16.0*pi)) * (1.0 + pow(cosTheta, 2.0));",
		"//	return (1.0 / (3.0*pi)) * (1.0 + pow(cosTheta, 2.0));",
		"//	return (3.0 / 4.0) * (1.0 + pow(cosTheta, 2.0));",
		"}",

		"vec3 totalMie(vec3 lambda, vec3 K, float T)",
		"{",
			"float c = (0.2 * T ) * 10E-18;",
			"return 0.434 * c * pi * pow((2.0 * pi) / lambda, vec3(v - 2.0)) * K;",
		"}",

		"float hgPhase(float cosTheta, float g)",
		"{",
			"return (1.0 / (4.0*pi)) * ((1.0 - pow(g, 2.0)) / pow(1.0 - 2.0*g*cosTheta + pow(g, 2.0), 1.5));",
		"}",

		"float sunIntensity(float zenithAngleCos)",
		"{",
		// This function originally used `exp(n)`, but it returns an incorrect value
		// on Samsung S6 phones. So it has been replaced with the equivalent `pow(e, n)`.
		// See https://github.com/mrdoob/three.js/issues/8382
			"return EE * max(0.0, 1.0 - pow(e, -((cutoffAngle - acos(zenithAngleCos))/steepness)));",
		"}",

		"// float logLuminance(vec3 c)",
		"// {",
		"// 	return log(c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722);",
		"// }",

		"// Filmic ToneMapping http://filmicgames.com/archives/75",
		"float A = 0.15;",
		"float B = 0.50;",
		"float C = 0.10;",
		"float D = 0.20;",
		"float E = 0.02;",
		"float F = 0.30;",
		"float W = 1000.0;",

		"vec3 Uncharted2Tonemap(vec3 x)",
		"{",
		   "return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;",
		"}",


		"void main() ",
		"{",
			"float sunfade = 1.0-clamp(1.0-exp((sunPosition.y/450000.0)),0.0,1.0);",

			"// luminance =  1.0 ;// vWorldPosition.y / 450000. + 0.5; //sunPosition.y / 450000. * 1. + 0.5;",

			 "// gl_FragColor = vec4(sunfade, sunfade, sunfade, 1.0);",

			"float reileighCoefficient = reileigh - (1.0* (1.0-sunfade));",

			"vec3 sunDirection = normalize(sunPosition);",

			"float sunE = sunIntensity(dot(sunDirection, up));",

			"// extinction (absorbtion + out scattering) ",
			"// rayleigh coefficients",

			// "vec3 betaR = totalRayleigh(lambda) * reileighCoefficient;",
			"vec3 betaR = simplifiedRayleigh() * reileighCoefficient;",

			"// mie coefficients",
			"vec3 betaM = totalMie(lambda, K, turbidity) * mieCoefficient;",

			"// optical length",
			"// cutoff angle at 90 to avoid singularity in next formula.",
			"float zenithAngle = acos(max(0.0, dot(up, normalize(vWorldPosition - cameraPos))));",
			"float sR = rayleighZenithLength / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));",
			"float sM = mieZenithLength / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));",



			"// combined extinction factor	",
			"vec3 Fex = exp(-(betaR * sR + betaM * sM));",

			"// in scattering",
			"float cosTheta = dot(normalize(vWorldPosition - cameraPos), sunDirection);",

			"float rPhase = rayleighPhase(cosTheta*0.5+0.5);",
			"vec3 betaRTheta = betaR * rPhase;",

			"float mPhase = hgPhase(cosTheta, mieDirectionalG);",
			"vec3 betaMTheta = betaM * mPhase;",


			"vec3 Lin = pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * (1.0 - Fex),vec3(1.5));",
			"Lin *= mix(vec3(1.0),pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * Fex,vec3(1.0/2.0)),clamp(pow(1.0-dot(up, sunDirection),5.0),0.0,1.0));",

			"//nightsky",
			"vec3 direction = normalize(vWorldPosition - cameraPos);",
			"float theta = acos(direction.y); // elevation --> y-axis, [-pi/2, pi/2]",
			"float phi = atan(direction.z, direction.x); // azimuth --> x-axis [-pi/2, pi/2]",
			"vec2 uv = vec2(phi, theta) / vec2(2.0*pi, pi) + vec2(0.5, 0.0);",
			"// vec3 L0 = texture2D(skySampler, uv).rgb+0.1 * Fex;",
			"vec3 L0 = vec3(0.1) * Fex;",

			"// composition + solar disc",
			"//if (cosTheta > sunAngularDiameterCos)",
			"float sundisk = smoothstep(sunAngularDiameterCos,sunAngularDiameterCos+0.00002,cosTheta);",
			"// if (normalize(vWorldPosition - cameraPos).y>0.0)",
			"L0 += (sunE * 19000.0 * Fex)*sundisk;",


			"vec3 whiteScale = 1.0/Uncharted2Tonemap(vec3(W));",

			"vec3 texColor = (Lin+L0);   ",
			"texColor *= 0.04 ;",
			"texColor += vec3(0.0,0.001,0.0025)*0.3;",

			"float g_fMaxLuminance = 1.0;",
			"float fLumScaled = 0.1 / luminance;     ",
			"float fLumCompressed = (fLumScaled * (1.0 + (fLumScaled / (g_fMaxLuminance * g_fMaxLuminance)))) / (1.0 + fLumScaled); ",

			"float ExposureBias = fLumCompressed;",

			"vec3 curr = Uncharted2Tonemap((log2(2.0/pow(luminance,4.0)))*texColor);",
			"vec3 color = curr*whiteScale;",

			"vec3 retColor = pow(color,vec3(1.0/(1.2+(1.2*sunfade))));",


			"gl_FragColor.rgb = retColor;",

			"gl_FragColor.a = 1.0;",
		"}",

	].join( "\n" )

};

THREE.Sky = function () {

	var skyShader = THREE.ShaderLib[ "sky" ];
	var skyUniforms = THREE.UniformsUtils.clone( skyShader.uniforms );

	var skyMat = new THREE.ShaderMaterial( {
		fragmentShader: skyShader.fragmentShader,
		vertexShader: skyShader.vertexShader,
		uniforms: skyUniforms,
		side: THREE.BackSide
	} );

	var skyGeo = new THREE.SphereBufferGeometry( 450000, 32, 15 );
	var skyMesh = new THREE.Mesh( skyGeo, skyMat );


	// Expose variables
	this.mesh = skyMesh;
	this.uniforms = skyUniforms;

};

/**
 * Controller class for the Timeliner GUI.
 *
 * Timeliner GUI library (required to use this class):
 *
 * 		./libs/timeliner_gui.min.js
 *
 * Source code:
 *
 * 		https://github.com/tschw/timeliner_gui
 * 		https://github.com/zz85/timeliner (fork's origin)
 *
 * @author tschw
 *
 */

THREE.TimelinerController = function TimelinerController( scene, trackInfo, onUpdate ) {

	this._scene = scene;
	this._trackInfo = trackInfo;

	this._onUpdate = onUpdate;

	this._mixer = new THREE.AnimationMixer( scene );
	this._clip = null;
	this._action = null;

	this._tracks = {};
	this._propRefs = {};
	this._channelNames = [];

};

THREE.TimelinerController.prototype = {

	constructor: THREE.TimelinerController,

	init: function( timeliner ) {

		var tracks = [],
			trackInfo = this._trackInfo;

		for ( var i = 0, n = trackInfo.length; i !== n; ++ i ) {

			var spec = trackInfo[ i ];

			tracks.push( this._addTrack(
					spec.type, spec.propertyPath,
					spec.initialValue, spec.interpolation ) );
		}

		this._clip = new THREE.AnimationClip( 'editclip', 0, tracks );
		this._action = this._mixer.clipAction( this._clip ).play();

	},

	setDisplayTime: function( time ) {

		this._action.time = time;
		this._mixer.update( 0 );

		this._onUpdate();

	},

	setDuration: function( duration ) {

		this._clip.duration = duration;

	},

	getChannelNames: function() {

		return this._channelNames;

	},

	getChannelKeyTimes: function( channelName ) {

		return this._tracks[ channelName ].times;

	},

	setKeyframe: function( channelName, time ) {

		var track = this._tracks[ channelName ],
			times = track.times,
			index = Timeliner.binarySearch( times, time ),
			values = track.values,
			stride = track.getValueSize(),
			offset = index * stride;

		if ( index < 0 ) {

			// insert new keyframe

			index = ~ index;
			offset = index * stride;

			var nTimes = times.length + 1,
				nValues = values.length + stride;

			for ( var i = nTimes - 1; i !== index; -- i ) {

				times[ i ] = times[ i - 1 ];

			}

			for ( var i = nValues - 1,
					e = offset + stride - 1; i !== e; -- i ) {

				values[ i ] = values[ i - stride ];

			}

		}

		times[ index ] = time;
		this._propRefs[ channelName ].getValue( values, offset );

	},

	delKeyframe: function( channelName, time ) {

		var track = this._tracks[ channelName ],
			times = track.times,
			index = Timeliner.binarySearch( times, time );

		// we disallow to remove the keyframe when it is the last one we have,
		// since the animation system is designed to always produce a defined
		// state

		if ( times.length > 1 && index >= 0 ) {

			var nTimes = times.length - 1,
				values = track.values,
				stride = track.getValueSize(),
				nValues = values.length - stride;

			// note: no track.getValueSize when array sizes are out of sync

			for ( var i = index; i !== nTimes; ++ i ) {

				times[ i ] = times[ i + 1 ];

			}

			times.pop();

			for ( var offset = index * stride; offset !== nValues; ++ offset ) {

				values[ offset ] = values[ offset + stride ];

			}

			values.length = nValues;

		}

	},

	moveKeyframe: function( channelName, time, delta, moveRemaining ) {

		var track = this._tracks[ channelName ],
			times = track.times,
			index = Timeliner.binarySearch( times, time );

		if ( index >= 0 ) {

			var endAt = moveRemaining ? times.length : index + 1,
				needsSort = times[ index - 1 ] <= time ||
					! moveRemaining && time >= times[ index + 1 ];

			while ( index !== endAt ) times[ index ++ ] += delta;

			if ( needsSort ) this._sort( track );

		}

	},

	serialize: function() {

		var result = {
				duration: this._clip.duration,
				channels: {}
			},

			names = this._channelNames,
			tracks = this._tracks,

			channels = result.channels;

		for ( var i = 0, n = names.length; i !== n; ++ i ) {

			var name = names[ i ],
				track = tracks[ name ];

			channels[ name ] = {

				times: track.times,
				values: track.values

			};

		}

		return result;

	},

	deserialize: function( structs ) {

		var names = this._channelNames,
			tracks = this._tracks,

			channels = structs.channels;

		this.setDuration( structs.duration );

		for ( var i = 0, n = names.length; i !== n; ++ i ) {

			var name = names[ i ],
				track = tracks[ name ];
				data = channels[ name ];

			this._setArray( track.times, data.times );
			this._setArray( track.values, data.values );

		}

		// update display
		this.setDisplayTime( this._mixer.time );

	},

	_sort: function( track ) {

		var times = track.times,
			order = THREE.AnimationUtils.getKeyframeOrder( times );

		this._setArray( times,
				THREE.AnimationUtils.sortedArray( times, 1, order ) );

		var values = track.values,
			stride = track.getValueSize();

		this._setArray( values,
				THREE.AnimationUtils.sortedArray( values, stride, order ) );

	},

	_setArray: function( dst, src ) {

		dst.length = 0;
		dst.push.apply( dst, src );

	},

	_addTrack: function( type, prop, initialValue, interpolation ) {

		var track = new type(
				prop, [ 0 ], initialValue, interpolation );

		// data must be in JS arrays so it can be resized
		track.times = Array.prototype.slice.call( track.times );
		track.values = Array.prototype.slice.call( track.values );

		this._channelNames.push( prop );
		this._tracks[ prop ] = track;

		// for recording the state:
		this._propRefs[ prop ] =
				new THREE.PropertyBinding( this._scene, prop );

		return track;

	}

};


THREE.TypedArrayUtils = {};

/**
 * In-place quicksort for typed arrays (e.g. for Float32Array)
 * provides fast sorting
 * useful e.g. for a custom shader and/or BufferGeometry
 *
 * @author Roman Bolzern <roman.bolzern@fhnw.ch>, 2013
 * @author I4DS http://www.fhnw.ch/i4ds, 2013
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 *
 * Complexity: http://bigocheatsheet.com/ see Quicksort
 *
 * Example: 
 * points: [x, y, z, x, y, z, x, y, z, ...]
 * eleSize: 3 //because of (x, y, z)
 * orderElement: 0 //order according to x
 */

THREE.TypedArrayUtils.quicksortIP = function ( arr, eleSize, orderElement ) {

	var stack = [];
	var sp = - 1;
	var left = 0;
	var right = arr.length / eleSize - 1;
	var tmp = 0.0, x = 0, y = 0;

	var swapF = function ( a, b ) {

		a *= eleSize; b *= eleSize;

		for ( y = 0; y < eleSize; y ++ ) {

			tmp = arr[ a + y ];
			arr[ a + y ] = arr[ b + y ];
			arr[ b + y ] = tmp;

		}

	};
	
	var i, j, swap = new Float32Array( eleSize ), temp = new Float32Array( eleSize );

	while ( true ) {

		if ( right - left <= 25 ) {

			for ( j = left + 1; j <= right; j ++ ) {

				for ( x = 0; x < eleSize; x ++ ) {
			
					swap[ x ] = arr[ j * eleSize + x ];

				}
				
				i = j - 1;
				
				while ( i >= left && arr[ i * eleSize + orderElement ] > swap[ orderElement ] ) {

					for ( x = 0; x < eleSize; x ++ ) {

						arr[ ( i + 1 ) * eleSize + x ] = arr[ i * eleSize + x ];

					}

					i --;

				}

				for ( x = 0; x < eleSize; x ++ ) {

					arr[ ( i + 1 ) * eleSize + x ] = swap[ x ];

				}

			}
			
			if ( sp == - 1 ) break;

			right = stack[ sp -- ]; //?
			left = stack[ sp -- ];

		} else {

			var median = ( left + right ) >> 1;

			i = left + 1;
			j = right;
	
			swapF( median, i );

			if ( arr[ left * eleSize + orderElement ] > arr[ right * eleSize + orderElement ] ) {
		
				swapF( left, right );
				
			}

			if ( arr[ i * eleSize + orderElement ] > arr[ right * eleSize + orderElement ] ) {
		
				swapF( i, right );
		
			}

			if ( arr[ left * eleSize + orderElement ] > arr[ i * eleSize + orderElement ] ) {
		
				swapF( left, i );
			
			}

			for ( x = 0; x < eleSize; x ++ ) {

				temp[ x ] = arr[ i * eleSize + x ];

			}
			
			while ( true ) {
				
				do i ++; while ( arr[ i * eleSize + orderElement ] < temp[ orderElement ] );
				do j --; while ( arr[ j * eleSize + orderElement ] > temp[ orderElement ] );
				
				if ( j < i ) break;
		
				swapF( i, j );
			
			}

			for ( x = 0; x < eleSize; x ++ ) {

				arr[ ( left + 1 ) * eleSize + x ] = arr[ j * eleSize + x ];
				arr[ j * eleSize + x ] = temp[ x ];

			}

			if ( right - i + 1 >= j - left ) {

				stack[ ++ sp ] = i;
				stack[ ++ sp ] = right;
				right = j - 1;

			} else {

				stack[ ++ sp ] = left;
				stack[ ++ sp ] = j - 1;
				left = i;

			}

		}

	}

	return arr;

};



/**
 * k-d Tree for typed arrays (e.g. for Float32Array), in-place
 * provides fast nearest neighbour search
 * useful e.g. for a custom shader and/or BufferGeometry, saves tons of memory
 * has no insert and remove, only buildup and neares neighbour search
 *
 * Based on https://github.com/ubilabs/kd-tree-javascript by Ubilabs
 *
 * @author Roman Bolzern <roman.bolzern@fhnw.ch>, 2013
 * @author I4DS http://www.fhnw.ch/i4ds, 2013
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 *
 * Requires typed array quicksort
 *
 * Example: 
 * points: [x, y, z, x, y, z, x, y, z, ...]
 * metric: function(a, b){	return Math.pow(a[0] - b[0], 2) +  Math.pow(a[1] - b[1], 2) +  Math.pow(a[2] - b[2], 2); }  //Manhatten distance
 * eleSize: 3 //because of (x, y, z)
 *
 * Further information (including mathematical properties)
 * http://en.wikipedia.org/wiki/Binary_tree
 * http://en.wikipedia.org/wiki/K-d_tree
 *
 * If you want to further minimize memory usage, remove Node.depth and replace in search algorithm with a traversal to root node (see comments at THREE.TypedArrayUtils.Kdtree.prototype.Node)
 */

 THREE.TypedArrayUtils.Kdtree = function ( points, metric, eleSize ) {

	var self = this;
	
	var maxDepth = 0;
	
	var getPointSet = function ( points, pos ) {

		return points.subarray( pos * eleSize, pos * eleSize + eleSize );

	};
		
	function buildTree( points, depth, parent, pos ) {

		var dim = depth % eleSize,
			median,
			node,
			plength = points.length / eleSize;

		if ( depth > maxDepth ) maxDepth = depth;
		
		if ( plength === 0 ) return null;
		if ( plength === 1 ) {

			return new self.Node( getPointSet( points, 0 ), depth, parent, pos );

		}

		THREE.TypedArrayUtils.quicksortIP( points, eleSize, dim );
		
		median = Math.floor( plength / 2 );
		
		node = new self.Node( getPointSet( points, median ), depth, parent, median + pos );
		node.left = buildTree( points.subarray( 0, median * eleSize ), depth + 1, node, pos );
		node.right = buildTree( points.subarray( ( median + 1 ) * eleSize, points.length ), depth + 1, node, pos + median + 1 );

		return node;
	
	}

	this.root = buildTree( points, 0, null, 0 );
		
	this.getMaxDepth = function () {

		return maxDepth;

	};
	
	this.nearest = function ( point, maxNodes, maxDistance ) {
	
		 /* point: array of size eleSize 
			maxNodes: max amount of nodes to return 
			maxDistance: maximum distance to point result nodes should have
			condition (not implemented): function to test node before it's added to the result list, e.g. test for view frustum
		*/

		var i,
			result,
			bestNodes;

		bestNodes = new THREE.TypedArrayUtils.Kdtree.BinaryHeap(

			function ( e ) {

				return - e[ 1 ];

			}

					);

		function nearestSearch( node ) {

			var bestChild,
				dimension = node.depth % eleSize,
				ownDistance = metric( point, node.obj ),
				linearDistance = 0,
				otherChild,
				i,
				linearPoint = [];

			function saveNode( node, distance ) {

				bestNodes.push( [ node, distance ] );

				if ( bestNodes.size() > maxNodes ) {

					bestNodes.pop();

				}

			}

			for ( i = 0; i < eleSize; i += 1 ) {

				if ( i === node.depth % eleSize ) {

					linearPoint[ i ] = point[ i ];

				} else {

					linearPoint[ i ] = node.obj[ i ];

				}

			}

			linearDistance = metric( linearPoint, node.obj );

			// if it's a leaf

			if ( node.right === null && node.left === null ) {

				if ( bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[ 1 ] ) {

					saveNode( node, ownDistance );

				}

				return;

			}

			if ( node.right === null ) {

				bestChild = node.left;

			} else if ( node.left === null ) {

				bestChild = node.right;

			} else {

				if ( point[ dimension ] < node.obj[ dimension ] ) {

					bestChild = node.left;

				} else {

					bestChild = node.right;

				}

			}

			// recursive search

			nearestSearch( bestChild );

			if ( bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[ 1 ] ) {

				saveNode( node, ownDistance );

			}

			// if there's still room or the current distance is nearer than the best distance

			if ( bestNodes.size() < maxNodes || Math.abs( linearDistance ) < bestNodes.peek()[ 1 ] ) {

				if ( bestChild === node.left ) {

					otherChild = node.right;

				} else {

					otherChild = node.left;

				}

				if ( otherChild !== null ) {

					nearestSearch( otherChild );

				}

			}

		}

		if ( maxDistance ) {

			for ( i = 0; i < maxNodes; i += 1 ) {

				bestNodes.push( [ null, maxDistance ] );

			}

		}

		nearestSearch( self.root );

		result = [];

		for ( i = 0; i < maxNodes; i += 1 ) {

			if ( bestNodes.content[ i ][ 0 ] ) {

				result.push( [ bestNodes.content[ i ][ 0 ], bestNodes.content[ i ][ 1 ] ] );

			}

		}
		
		return result;
	
	};
	
};

/**
 * If you need to free up additional memory and agree with an additional O( log n ) traversal time you can get rid of "depth" and "pos" in Node:
 * Depth can be easily done by adding 1 for every parent (care: root node has depth 0, not 1)
 * Pos is a bit tricky: Assuming the tree is balanced (which is the case when after we built it up), perform the following steps:
 *   By traversing to the root store the path e.g. in a bit pattern (01001011, 0 is left, 1 is right)
 *   From buildTree we know that "median = Math.floor( plength / 2 );", therefore for each bit...
 *     0: amountOfNodesRelevantForUs = Math.floor( (pamountOfNodesRelevantForUs - 1) / 2 );
 *     1: amountOfNodesRelevantForUs = Math.ceil( (pamountOfNodesRelevantForUs - 1) / 2 );
 *        pos += Math.floor( (pamountOfNodesRelevantForUs - 1) / 2 );
 *     when recursion done, we still need to add all left children of target node:
 *        pos += Math.floor( (pamountOfNodesRelevantForUs - 1) / 2 );
 *        and I think you need to +1 for the current position, not sure.. depends, try it out ^^
 *
 * I experienced that for 200'000 nodes you can get rid of 4 MB memory each, leading to 8 MB memory saved.
 */
THREE.TypedArrayUtils.Kdtree.prototype.Node = function ( obj, depth, parent, pos ) {

	this.obj = obj;
	this.left = null;
	this.right = null;
	this.parent = parent;
	this.depth = depth;
	this.pos = pos;

}; 

/**
 * Binary heap implementation
 * @author http://eloquentjavascript.net/appendix2.htm
 */

THREE.TypedArrayUtils.Kdtree.BinaryHeap = function ( scoreFunction ) {

	this.content = [];
	this.scoreFunction = scoreFunction;

};

THREE.TypedArrayUtils.Kdtree.BinaryHeap.prototype = {

	push: function ( element ) {

		// Add the new element to the end of the array.
		this.content.push( element );

		// Allow it to bubble up.
		this.bubbleUp( this.content.length - 1 );

	},

	pop: function () {

		// Store the first element so we can return it later.
		var result = this.content[ 0 ];

		// Get the element at the end of the array.
		var end = this.content.pop();

		// If there are any elements left, put the end element at the
		// start, and let it sink down.
		if ( this.content.length > 0 ) {

			this.content[ 0 ] = end;
			this.sinkDown( 0 );

		}

		return result;

	},

	peek: function () {

		return this.content[ 0 ];

	},

	remove: function ( node ) {

		var len = this.content.length;

		// To remove a value, we must search through the array to find it.
		for ( var i = 0; i < len; i ++ ) {

			if ( this.content[ i ] == node ) {

				// When it is found, the process seen in 'pop' is repeated
				// to fill up the hole.
				var end = this.content.pop();

				if ( i != len - 1 ) {

					this.content[ i ] = end;

					if ( this.scoreFunction( end ) < this.scoreFunction( node ) ) {

						this.bubbleUp( i );

					} else {

						this.sinkDown( i );

					}

				}

				return;

			}

		}

		throw new Error( "Node not found." );

	},

	size: function () {

		return this.content.length;

	},

	bubbleUp: function ( n ) {

		// Fetch the element that has to be moved.
		var element = this.content[ n ];

		// When at 0, an element can not go up any further.
		while ( n > 0 ) {

			// Compute the parent element's index, and fetch it.
			var parentN = Math.floor( ( n + 1 ) / 2 ) - 1,
				parent = this.content[ parentN ];

			// Swap the elements if the parent is greater.
			if ( this.scoreFunction( element ) < this.scoreFunction( parent ) ) {

				this.content[ parentN ] = element;
				this.content[ n ] = parent;

				// Update 'n' to continue at the new position.
				n = parentN;

			} else {

				// Found a parent that is less, no need to move it further.
				break;

			}

		}

	},

	sinkDown: function ( n ) {

		// Look up the target element and its score.
		var length = this.content.length,
			element = this.content[ n ],
			elemScore = this.scoreFunction( element );

		while ( true ) {

			// Compute the indices of the child elements.
			var child2N = ( n + 1 ) * 2, child1N = child2N - 1;

			// This is used to store the new position of the element, if any.
			var swap = null;

			// If the first child exists (is inside the array)...
			if ( child1N < length ) {

				// Look it up and compute its score.
				var child1 = this.content[ child1N ],
					child1Score = this.scoreFunction( child1 );

				// If the score is less than our element's, we need to swap.
				if ( child1Score < elemScore ) swap = child1N;

			}

			// Do the same checks for the other child.
			if ( child2N < length ) {

				var child2 = this.content[ child2N ],
					child2Score = this.scoreFunction( child2 );

				if ( child2Score < ( swap === null ? elemScore : child1Score ) ) swap = child2N;

			}

			// If the element needs to be moved, swap it, and continue.
			if ( swap !== null ) {

				this.content[ n ] = this.content[ swap ];
				this.content[ swap ] = element;
				n = swap;

			} else {

				// Otherwise, we are done.
				break;

			}

		}

	}

};

THREE.UCSCharacter = function() {

	var scope = this;

	var mesh;

	this.scale = 1;

	this.root = new THREE.Object3D();

	this.numSkins;
	this.numMorphs;

	this.skins = [];
	this.materials = [];
	this.morphs = [];

	this.mixer = new THREE.AnimationMixer( this.root );

	this.onLoadComplete = function () {};

	this.loadCounter = 0;

	this.loadParts = function ( config ) {

		this.numSkins = config.skins.length;
		this.numMorphs = config.morphs.length;

		// Character geometry + number of skins
		this.loadCounter = 1 + config.skins.length;

		// SKINS
		this.skins = loadTextures( config.baseUrl + "skins/", config.skins );
		this.materials = createMaterials( this.skins );

		// MORPHS
		this.morphs = config.morphs;

		// CHARACTER
		var loader = new THREE.JSONLoader();
		console.log( config.baseUrl + config.character );
		loader.load( config.baseUrl + config.character, function( geometry ) {

			geometry.computeBoundingBox();
			geometry.computeVertexNormals();

			mesh = new THREE.SkinnedMesh( geometry, new THREE.MultiMaterial() );
			mesh.name = config.character;
			scope.root.add( mesh );

			var bb = geometry.boundingBox;
			scope.root.scale.set( config.s, config.s, config.s );
			scope.root.position.set( config.x, config.y - bb.min.y * config.s, config.z );

			mesh.castShadow = true;
			mesh.receiveShadow = true;

			scope.mixer.clipAction( geometry.animations[0], mesh ).play();

			scope.setSkin( 0 );

			scope.checkLoadComplete();

		} );

	};

	this.setSkin = function( index ) {

		if ( mesh && scope.materials ) {

			mesh.material = scope.materials[ index ];

		}

	};

	this.updateMorphs = function( influences ) {

		if ( mesh ) {

			for ( var i = 0; i < scope.numMorphs; i ++ ) {

				mesh.morphTargetInfluences[ i ] = influences[ scope.morphs[ i ] ] / 100;

			}

		}

	};

	function loadTextures( baseUrl, textureUrls ) {

		var textureLoader = new THREE.TextureLoader();
		var textures = [];

		for ( var i = 0; i < textureUrls.length; i ++ ) {

			textures[ i ] = textureLoader.load( baseUrl + textureUrls[ i ], scope.checkLoadComplete );
			textures[ i ].mapping = THREE.UVMapping;
			textures[ i ].name = textureUrls[ i ];

		}

		return textures;

	}

	function createMaterials( skins ) {

		var materials = [];

		for ( var i = 0; i < skins.length; i ++ ) {

			materials[ i ] = new THREE.MeshLambertMaterial( {
				color: 0xeeeeee,
				specular: 10.0,
				map: skins[ i ],
				skinning: true,
				morphTargets: true
			} );

		}

		return materials;

	}

	this.checkLoadComplete = function () {

		scope.loadCounter -= 1;

		if ( scope.loadCounter === 0 ) {

			scope.onLoadComplete();

		}

	}

};

THREE.ViveController = function ( id ) {

	THREE.Object3D.call( this );

	this.matrixAutoUpdate = false;
	this.standingMatrix = new THREE.Matrix4();

	var scope = this;

	function update() {

		requestAnimationFrame( update );

		var gamepad = navigator.getGamepads()[ id ];

		if ( gamepad !== undefined && gamepad.pose !== null ) {

			var pose = gamepad.pose;

			scope.position.fromArray( pose.position );
			scope.quaternion.fromArray( pose.orientation );
			scope.matrix.compose( scope.position, scope.quaternion, scope.scale );
			scope.matrix.multiplyMatrices( scope.standingMatrix, scope.matrix );
			scope.matrixWorldNeedsUpdate = true;

			scope.visible = true;

		} else {

			scope.visible = false;

		}

	}

	update();

};

THREE.ViveController.prototype = Object.create( THREE.Object3D.prototype );
THREE.ViveController.prototype.constructor = THREE.ViveController;

/**
 * This class had been written to handle the output of the NRRD loader.
 * It contains a volume of data and informations about it.
 * For now it only handles 3 dimensional data.
 * See the webgl_loader_nrrd.html example and the loaderNRRD.js file to see how to use this class.
 * @class
 * @author Valentin Demeusy / https://github.com/stity
 * @param   {number}        xLength         Width of the volume
 * @param   {number}        yLength         Length of the volume
 * @param   {number}        zLength         Depth of the volume
 * @param   {string}        type            The type of data (uint8, uint16, ...)
 * @param   {ArrayBuffer}   arrayBuffer     The buffer with volume data
 */
THREE.Volume = function( xLength, yLength, zLength, type, arrayBuffer ) {

	if ( arguments.length > 0 ) {

		/**
		 * @member {number} xLength Width of the volume in the IJK coordinate system
		 */
		this.xLength = Number( xLength ) || 1;
		/**
		 * @member {number} yLength Height of the volume in the IJK coordinate system
		 */
		this.yLength = Number( yLength ) || 1;
		/**
		 * @member {number} zLength Depth of the volume in the IJK coordinate system
		 */
		this.zLength = Number( zLength ) || 1;

		/**
		 * @member {TypedArray} data Data of the volume
		 */

		switch ( type ) {

			case 'Uint8' :
			case 'uint8' :
			case 'uchar' :
			case 'unsigned char' :
			case 'uint8_t' :
				this.data = new Uint8Array( arrayBuffer );
				break;
			case 'Int8' :
			case 'int8' :
			case 'signed char' :
			case 'int8_t' :
				this.data = new Int8Array( arrayBuffer );
				break;
			case 'Int16' :
			case 'int16' :
			case 'short' :
			case 'short int' :
			case 'signed short' :
			case 'signed short int' :
			case 'int16_t' :
				this.data = new Int16Array( arrayBuffer );
				break;
			case 'Uint16' :
			case 'uint16' :
			case 'ushort' :
			case 'unsigned short' :
			case 'unsigned short int' :
			case 'uint16_t' :
				this.data = new Uint16Array( arrayBuffer );
				break;
			case 'Int32' :
			case 'int32' :
			case 'int' :
			case 'signed int' :
			case 'int32_t' :
				this.data = new Int32Array( arrayBuffer );
				break;
			case 'Uint32' :
			case 'uint32' :
			case 'uint' :
			case 'unsigned int' :
			case 'uint32' :
			case 'uint32_t' :
				this.data = new Uint32Array( arrayBuffer );
				break;
			case 'longlong' :
			case 'long long' :
			case 'long long int' :
			case 'signed long long' :
			case 'signed long long int' :
			case 'int64' :
			case 'int64_t' :
			case 'ulonglong' :
			case 'unsigned long long' :
			case 'unsigned long long int' :
			case 'uint64' :
			case 'uint64_t' :
				throw 'Error in THREE.Volume constructor : this type is not supported in JavaScript';
				break;
			case 'Float32' :
			case 'float32' :
			case 'float' :
				this.data = new Float32Array( arrayBuffer );
				break;
			case 'Float64' :
			case 'float64' :
			case 'double' :
				this.data = new Float64Array( arrayBuffer );
				break;
			default :
				this.data = new Uint8Array( arrayBuffer );

		}

		if ( this.data.length !== this.xLength * this.yLength * this.zLength ) {

			throw 'Error in THREE.Volume constructor, lengths are not matching arrayBuffer size';

		}

	}

	/**
	 * @member {Array}  spacing Spacing to apply to the volume from IJK to RAS coordinate system
	 */
	this.spacing = [ 1, 1, 1 ];
	/**
	 * @member {Array}  offset Offset of the volume in the RAS coordinate system
	 */
	this.offset = [ 0, 0, 0 ];
	/**
	 * @member {THREE.Martrix3} matrix The IJK to RAS matrix
	 */
	this.matrix = new THREE.Matrix3();
	this.matrix.identity();
	/**
	 * @member {THREE.Martrix3} inverseMatrix The RAS to IJK matrix
	 */
	/**
	 * @member {number} lowerThreshold The voxels with values under this threshold won't appear in the slices.
	 *                      If changed, geometryNeedsUpdate is automatically set to true on all the slices associated to this volume
	 */
	var lowerThreshold = - Infinity;
	Object.defineProperty( this, 'lowerThreshold', {
		get : function() {

			return lowerThreshold;

		},
		set : function( value ) {

			lowerThreshold = value;
			this.sliceList.forEach( function( slice ) {

				slice.geometryNeedsUpdate = true

			} );

		}
	} );
	/**
	 * @member {number} upperThreshold The voxels with values over this threshold won't appear in the slices.
	 *                      If changed, geometryNeedsUpdate is automatically set to true on all the slices associated to this volume
	 */
	var upperThreshold = Infinity;
	Object.defineProperty( this, 'upperThreshold', {
		get : function() {

			return upperThreshold;

		},
		set : function( value ) {

			upperThreshold = value;
			this.sliceList.forEach( function( slice ) {

				slice.geometryNeedsUpdate = true;

			} );

		}
	} );


	/**
	 * @member {Array} sliceList The list of all the slices associated to this volume
	 */
	this.sliceList = [];


	/**
	 * @member {Array} RASDimensions This array holds the dimensions of the volume in the RAS space
	 */

}

THREE.Volume.prototype = {

	constructor : THREE.Volume,

	/**
	 * @member {Function} getData Shortcut for data[access(i,j,k)]
	 * @memberof THREE.Volume
	 * @param {number} i    First coordinate
	 * @param {number} j    Second coordinate
	 * @param {number} k    Third coordinate
	 * @returns {number}  value in the data array
	 */
	getData : function( i, j, k ) {

		return this.data[ k * this.xLength * this.yLength + j * this.xLength + i ];

	},

	/**
	 * @member {Function} access compute the index in the data array corresponding to the given coordinates in IJK system
	 * @memberof THREE.Volume
	 * @param {number} i    First coordinate
	 * @param {number} j    Second coordinate
	 * @param {number} k    Third coordinate
	 * @returns {number}  index
	 */
	access : function( i, j, k ) {

		return k * this.xLength * this.yLength + j * this.xLength + i;

	},

	/**
	 * @member {Function} reverseAccess Retrieve the IJK coordinates of the voxel corresponding of the given index in the data
	 * @memberof THREE.Volume
	 * @param {number} index index of the voxel
	 * @returns {Array}  [x,y,z]
	 */
	reverseAccess : function( index ) {

		var z = Math.floor( index / ( this.yLength * this.xLength ) );
		var y = Math.floor( ( index - z * this.yLength * this.xLength ) / this.xLength );
		var x = index - z * this.yLength * this.xLength - y * this.xLength;
		return [ x, y, z ];

	},

	/**
	 * @member {Function} map Apply a function to all the voxels, be careful, the value will be replaced
	 * @memberof THREE.Volume
	 * @param {Function} functionToMap A function to apply to every voxel, will be called with the following parameters :
	 *                                 value of the voxel
	 *                                 index of the voxel
	 *                                 the data (TypedArray)
	 * @param {Object}   context    You can specify a context in which call the function, default if this Volume
	 * @returns {THREE.Volume}   this
	 */
	map : function( functionToMap, context ) {

		var length = this.data.length;
		context = context || this;

		for ( var i = 0; i < length; i ++ ) {

			this.data[ i ] = functionToMap.call( context, this.data[ i ], i, this.data );

		}

		return this;

	},

	/**
	 * @member {Function} extractPerpendicularPlane Compute the orientation of the slice and returns all the information relative to the geometry such as sliceAccess, the plane matrix (orientation and position in RAS coordinate) and the dimensions of the plane in both coordinate system.
	 * @memberof THREE.Volume
	 * @param {string}            axis  the normal axis to the slice 'x' 'y' or 'z'
	 * @param {number}            index the index of the slice
	 * @returns {Object} an object containing all the usefull information on the geometry of the slice
	 */
	extractPerpendicularPlane : function( axis, RASIndex ) {

		var iLength,
		jLength,
		sliceAccess,
		planeMatrix = ( new THREE.Matrix4() ).identity(),
		volume = this,
		planeWidth,
		planeHeight,
		firstSpacing,
		secondSpacing,
		positionOffset,
		IJKIndex;

		var axisInIJK = new THREE.Vector3(),
		firstDirection = new THREE.Vector3(),
		secondDirection = new THREE.Vector3();

		var dimensions = new THREE.Vector3( this.xLength, this.yLength, this.zLength );


		switch ( axis ) {

			case 'x' :
				axisInIJK.set( 1, 0, 0 );
				firstDirection.set( 0, 0, - 1 );
				secondDirection.set( 0, - 1, 0 );
				firstSpacing = this.spacing[ 2 ];
				secondSpacing = this.spacing[ 1 ];
				IJKIndex = new THREE.Vector3( RASIndex, 0, 0 );

				planeMatrix.multiply( ( new THREE.Matrix4() ).makeRotationY( Math.PI / 2 ) );
				positionOffset = ( volume.RASDimensions[ 0 ] - 1 ) / 2;
				planeMatrix.setPosition( new THREE.Vector3( RASIndex - positionOffset, 0, 0 ) );
				break;
			case 'y' :
				axisInIJK.set( 0, 1, 0 );
				firstDirection.set( 1, 0, 0 );
				secondDirection.set( 0, 0, 1 );
				firstSpacing = this.spacing[ 0 ];
				secondSpacing = this.spacing[ 2 ];
				IJKIndex = new THREE.Vector3( 0, RASIndex, 0 );

				planeMatrix.multiply( ( new THREE.Matrix4() ).makeRotationX( - Math.PI / 2 ) );
				positionOffset = ( volume.RASDimensions[ 1 ] - 1 ) / 2;
				planeMatrix.setPosition( new THREE.Vector3( 0, RASIndex - positionOffset, 0 ) );
				break;
			case 'z' :
			default :
				axisInIJK.set( 0, 0, 1 );
				firstDirection.set( 1, 0, 0 );
				secondDirection.set( 0, - 1, 0 );
				firstSpacing = this.spacing[ 0 ];
				secondSpacing = this.spacing[ 1 ];
				IJKIndex = new THREE.Vector3( 0, 0, RASIndex );

				positionOffset = ( volume.RASDimensions[ 2 ] - 1 ) / 2;
				planeMatrix.setPosition( new THREE.Vector3( 0, 0, RASIndex - positionOffset ) );
				break;
		}

		firstDirection.applyMatrix4( volume.inverseMatrix ).normalize();
		firstDirection.argVar = 'i';
		secondDirection.applyMatrix4( volume.inverseMatrix ).normalize();
		secondDirection.argVar = 'j';
		axisInIJK.applyMatrix4( volume.inverseMatrix ).normalize();
		iLength = Math.floor( Math.abs( firstDirection.dot( dimensions ) ) );
		jLength = Math.floor( Math.abs( secondDirection.dot( dimensions ) ) );
		planeWidth = Math.abs( iLength * firstSpacing );
		planeHeight = Math.abs( jLength * secondSpacing );

		IJKIndex = Math.abs( Math.round( IJKIndex.applyMatrix4( volume.inverseMatrix ).dot( axisInIJK ) ) );
		var base = [ new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 1 ) ];
		var iDirection = [ firstDirection, secondDirection, axisInIJK ].find( function( x ) {

			return Math.abs( x.dot( base[ 0 ] ) ) > 0.9;

		} );
		var jDirection = [ firstDirection, secondDirection, axisInIJK ].find( function( x ) {

			return Math.abs( x.dot( base[ 1 ] ) ) > 0.9;

		} );
		var kDirection = [ firstDirection, secondDirection, axisInIJK ].find( function( x ) {

			return Math.abs( x.dot( base[ 2 ] ) ) > 0.9;

		} );
		var argumentsWithInversion = [ 'volume.xLength-1-', 'volume.yLength-1-', 'volume.zLength-1-' ];
		var arguments = [ 'i', 'j', 'k' ];
		var argArray = [ iDirection, jDirection, kDirection ].map( function( direction, n ) {

			return ( direction.dot( base[ n ] ) > 0 ? '' : argumentsWithInversion[ n ] ) + ( direction === axisInIJK ? 'IJKIndex' : direction.argVar )

		} );
		var argString = argArray.join( ',' );
		sliceAccess = eval( '(function sliceAccess (i,j) {return volume.access( ' + argString + ');})' );


		return {
			iLength : iLength,
			jLength : jLength,
			sliceAccess : sliceAccess,
			matrix : planeMatrix,
			planeWidth : planeWidth,
			planeHeight : planeHeight
		}

	},

	/**
	 * @member {Function} extractSlice Returns a slice corresponding to the given axis and index
	 *                        The coordinate are given in the Right Anterior Superior coordinate format
	 * @memberof THREE.Volume
	 * @param {string}            axis  the normal axis to the slice 'x' 'y' or 'z'
	 * @param {number}            index the index of the slice
	 * @returns {THREE.VolumeSlice} the extracted slice
	 */
	extractSlice : function( axis, index ) {

		var slice = new THREE.VolumeSlice( this, index, axis );
		this.sliceList.push( slice );
		return slice;

	},

	/**
	 * @member {Function} repaintAllSlices Call repaint on all the slices extracted from this volume
	 * @see THREE.VolumeSlice.repaint
	 * @memberof THREE.Volume
	 * @returns {THREE.Volume} this
	 */
	repaintAllSlices : function() {

		this.sliceList.forEach( function( slice ) {

			slice.repaint();

		} );

		return this;

	},

	/**
	 * @member {Function} computeMinMax Compute the minimum and the maximum of the data in the volume
	 * @memberof THREE.Volume
	 * @returns {Array} [min,max]
	 */
	computeMinMax : function() {

		var min = Infinity;
		var max = - Infinity;

		// buffer the length
		var datasize = this.data.length;

		var i = 0;
		for ( i = 0; i < datasize; i ++ ) {

			if ( ! isNaN( this.data[ i ] ) ) {

				var value = this.data[ i ];
				min = Math.min( min, value );
				max = Math.max( max, value );

			}

		}
		this.min = min;
		this.max = max;

		return [ min, max ];

	}

}

/**
 * This class has been made to hold a slice of a volume data
 * @class
 * @author Valentin Demeusy / https://github.com/stity
 * @param   {THREE.Volume} volume    The associated volume
 * @param   {number}       [index=0] The index of the slice
 * @param   {string}       [axis='z']      For now only 'x', 'y' or 'z' but later it will change to a normal vector
 * @see THREE.Volume
 */
THREE.VolumeSlice = function( volume, index, axis ) {

	var slice = this;
	/**
	 * @member {THREE.Volume} volume The associated volume
	 */
	this.volume = volume;
	/**
	 * @member {Number} index The index of the slice, if changed, will automatically call updateGeometry at the next repaint
	 */
	index = index || 0;
	Object.defineProperty( this, 'index', {
		get : function() {

			return index;

		},
		set : function( value ) {

			index = value;
			slice.geometryNeedsUpdate = true;
			return index;

		}
	} );
	/**
	 * @member {String} axis The normal axis
	 */
	this.axis = axis || 'z';

	/**
	 * @member {HTMLCanvasElement} canvas The final canvas used for the texture
	 */
	/**
	 * @member {CanvasRenderingContext2D} ctx Context of the canvas
	 */
	this.canvas = document.createElement( 'canvas' );
	/**
	 * @member {HTMLCanvasElement} canvasBuffer The intermediary canvas used to paint the data
	 */
	/**
	 * @member {CanvasRenderingContext2D} ctxBuffer Context of the canvas buffer
	 */
	this.canvasBuffer = document.createElement( 'canvas' );
	this.updateGeometry();


	var canvasMap = new THREE.Texture( this.canvas );
	canvasMap.minFilter = THREE.LinearFilter;
	canvasMap.wrapS = canvasMap.wrapT = THREE.ClampToEdgeWrapping;
	var material = new THREE.MeshBasicMaterial( { map: canvasMap, side: THREE.DoubleSide, transparent : true } );
	/**
	 * @member {THREE.Mesh} mesh The mesh ready to get used in the scene
	 */
	this.mesh = new THREE.Mesh( this.geometry, material );
	/**
	 * @member {Boolean} geometryNeedsUpdate If set to true, updateGeometry will be triggered at the next repaint
	 */
	this.geometryNeedsUpdate = true;
	this.repaint();

	/**
	 * @member {Number} iLength Width of slice in the original coordinate system, corresponds to the width of the buffer canvas
	 */

	/**
	 * @member {Number} jLength Height of slice in the original coordinate system, corresponds to the height of the buffer canvas
	 */

	/**
	 * @member {Function} sliceAccess Function that allow the slice to access right data
	 * @see THREE.Volume.extractPerpendicularPlane
	 * @param {Number} i The first coordinate
	 * @param {Number} j The second coordinate
	 * @returns {Number} the index corresponding to the voxel in volume.data of the given position in the slice
	 */


}

THREE.VolumeSlice.prototype = {

	constructor : THREE.VolumeSlice,

	/**
	 * @member {Function} repaint Refresh the texture and the geometry if geometryNeedsUpdate is set to true
	 * @memberof THREE.VolumeSlice
	 */
	repaint : function() {

		if ( this.geometryNeedsUpdate ) {

			this.updateGeometry();

		}

		var iLength = this.iLength,
		jLength = this.jLength,
		sliceAccess = this.sliceAccess,
		volume = this.volume,
		axis = this.axis,
		index = this.index,
		canvas = this.canvasBuffer,
		ctx = this.ctxBuffer;


		// get the imageData and pixel array from the canvas
		var imgData = ctx.getImageData( 0, 0, iLength, jLength );
		var data = imgData.data;
		var volumeData = volume.data;
		var upperThreshold = volume.upperThreshold;
		var lowerThreshold = volume.lowerThreshold;
		var windowLow = volume.windowLow;
		var windowHigh = volume.windowHigh;

		// manipulate some pixel elements
		var pixelCount = 0;

		if ( volume.dataType === 'label' ) {

			//this part is currently useless but will be used when colortables will be handled
			for ( var j = 0; j < jLength; j ++ ) {

				for ( var i = 0; i < iLength; i ++ ) {

					var label = volumeData[ sliceAccess( i, j ) ];
					label = label >= this.colorMap.length ? ( label % this.colorMap.length ) + 1 : label;
					var color = this.colorMap[ label ];
					data[ 4 * pixelCount ] = ( color >> 24 ) & 0xff;
					data[ 4 * pixelCount + 1 ] = ( color >> 16 ) & 0xff;
					data[ 4 * pixelCount + 2 ] = ( color >> 8 ) & 0xff;
					data[ 4 * pixelCount + 3 ] = color & 0xff;
					pixelCount ++;

				}

			}

		}
		else {

			for ( var j = 0; j < jLength; j ++ ) {

				for ( var i = 0; i < iLength; i ++ ) {

					var value = volumeData[ sliceAccess( i, j ) ];
					var alpha = 0xff;
					//apply threshold
					alpha = upperThreshold >= value ? ( lowerThreshold <= value ? alpha : 0 ) : 0;
					//apply window level
					value = Math.floor( 255 * ( value - windowLow ) / ( windowHigh - windowLow ) );
					value = value > 255 ? 255 : ( value < 0 ? 0 : value | 0 );

					data[ 4 * pixelCount ] = value;
					data[ 4 * pixelCount + 1 ] = value;
					data[ 4 * pixelCount + 2 ] = value;
					data[ 4 * pixelCount + 3 ] = alpha;
					pixelCount ++;

				}

			}

		}
		ctx.putImageData( imgData, 0, 0 );
		this.ctx.drawImage( canvas, 0, 0, iLength, jLength, 0, 0, this.canvas.width, this.canvas.height );


		this.mesh.material.map.needsUpdate = true;

	},

	/**
	 * @member {Function} Refresh the geometry according to axis and index
	 * @see THREE.Volume.extractPerpendicularPlane
	 * @memberof THREE.VolumeSlice
	 */
	updateGeometry : function() {

		var extracted = this.volume.extractPerpendicularPlane( this.axis, this.index );
		this.sliceAccess = extracted.sliceAccess;
		this.jLength = extracted.jLength;
		this.iLength = extracted.iLength;
		this.matrix = extracted.matrix;

		this.canvas.width = extracted.planeWidth;
		this.canvas.height = extracted.planeHeight;
		this.canvasBuffer.width = this.iLength;
		this.canvasBuffer.height = this.jLength;
		this.ctx = this.canvas.getContext( '2d' );
		this.ctxBuffer = this.canvasBuffer.getContext( '2d' );

		this.geometry = new THREE.PlaneGeometry( extracted.planeWidth, extracted.planeHeight );

		if ( this.mesh ) {

			this.mesh.geometry = this.geometry;
			//reset mesh matrix
			this.mesh.matrix = ( new THREE.Matrix4() ).identity();
			this.mesh.applyMatrix( this.matrix );

		}

		this.geometryNeedsUpdate = false;

	}

}

/**
 * @author jbouny / https://github.com/jbouny
 *
 * Work based on :
 * @author Slayvin / http://slayvin.net : Flat mirror for three.js
 * @author Stemkoski / http://www.adelphi.edu/~stemkoski : An implementation of water shader based on the flat mirror
 * @author Jonas Wagner / http://29a.ch/ && http://29a.ch/slides/2012/webglwater/ : Water shader explanations in WebGL
 */

THREE.ShaderLib[ 'water' ] = {

	uniforms: THREE.UniformsUtils.merge( [
		THREE.UniformsLib[ "fog" ], {
			"normalSampler":    { value: null },
			"mirrorSampler":    { value: null },
			"alpha":            { value: 1.0 },
			"time":             { value: 0.0 },
			"distortionScale":  { value: 20.0 },
			"noiseScale":       { value: 1.0 },
			"textureMatrix" :   { value: new THREE.Matrix4() },
			"sunColor":         { value: new THREE.Color( 0x7F7F7F ) },
			"sunDirection":     { value: new THREE.Vector3( 0.70707, 0.70707, 0 ) },
			"eye":              { value: new THREE.Vector3() },
			"waterColor":       { value: new THREE.Color( 0x555555 ) }
		}
	] ),

	vertexShader: [
		'uniform mat4 textureMatrix;',
		'uniform float time;',

		'varying vec4 mirrorCoord;',
		'varying vec3 worldPosition;',

		'void main()',
		'{',
		'	mirrorCoord = modelMatrix * vec4( position, 1.0 );',
		'	worldPosition = mirrorCoord.xyz;',
		'	mirrorCoord = textureMatrix * mirrorCoord;',
		'	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
		'}'
	].join( '\n' ),

	fragmentShader: [
		'precision highp float;',

		'uniform sampler2D mirrorSampler;',
		'uniform float alpha;',
		'uniform float time;',
		'uniform float distortionScale;',
		'uniform sampler2D normalSampler;',
		'uniform vec3 sunColor;',
		'uniform vec3 sunDirection;',
		'uniform vec3 eye;',
		'uniform vec3 waterColor;',

		'varying vec4 mirrorCoord;',
		'varying vec3 worldPosition;',

		'vec4 getNoise( vec2 uv )',
		'{',
		'	vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);',
		'	vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );',
		'	vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );',
		'	vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );',
		'	vec4 noise = texture2D( normalSampler, uv0 ) +',
		'		texture2D( normalSampler, uv1 ) +',
		'		texture2D( normalSampler, uv2 ) +',
		'		texture2D( normalSampler, uv3 );',
		'	return noise * 0.5 - 1.0;',
		'}',

		'void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor )',
		'{',
		'	vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );',
		'	float direction = max( 0.0, dot( eyeDirection, reflection ) );',
		'	specularColor += pow( direction, shiny ) * sunColor * spec;',
		'	diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;',
		'}',

		THREE.ShaderChunk[ "common" ],
		THREE.ShaderChunk[ "fog_pars_fragment" ],

		'void main()',
		'{',
		'	vec4 noise = getNoise( worldPosition.xz );',
		'	vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );',

		'	vec3 diffuseLight = vec3(0.0);',
		'	vec3 specularLight = vec3(0.0);',

		'	vec3 worldToEye = eye-worldPosition;',
		'	vec3 eyeDirection = normalize( worldToEye );',
		'	sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );',

		'	float distance = length(worldToEye);',

		'	vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;',
		'	vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.z + distortion ) );',

		'	float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );',
		'	float rf0 = 0.3;',
		'	float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );',
		'	vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;',
		'	vec3 albedo = mix( sunColor * diffuseLight * 0.3 + scatter, ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance );',
		'	vec3 outgoingLight = albedo;',
			THREE.ShaderChunk[ "fog_fragment" ],
		'	gl_FragColor = vec4( outgoingLight, alpha );',
		'}'
	].join( '\n' )

};

THREE.Water = function ( renderer, camera, scene, options ) {

	THREE.Object3D.call( this );
	this.name = 'water_' + this.id;

	function optionalParameter ( value, defaultValue ) {

		return value !== undefined ? value : defaultValue;

	}

	options = options || {};

	this.matrixNeedsUpdate = true;

	var width = optionalParameter( options.textureWidth, 512 );
	var height = optionalParameter( options.textureHeight, 512 );
	this.clipBias = optionalParameter( options.clipBias, 0.0 );
	this.alpha = optionalParameter( options.alpha, 1.0 );
	this.time = optionalParameter( options.time, 0.0 );
	this.normalSampler = optionalParameter( options.waterNormals, null );
	this.sunDirection = optionalParameter( options.sunDirection, new THREE.Vector3( 0.70707, 0.70707, 0.0 ) );
	this.sunColor = new THREE.Color( optionalParameter( options.sunColor, 0xffffff ) );
	this.waterColor = new THREE.Color( optionalParameter( options.waterColor, 0x7F7F7F ) );
	this.eye = optionalParameter( options.eye, new THREE.Vector3( 0, 0, 0 ) );
	this.distortionScale = optionalParameter( options.distortionScale, 20.0 );
	this.side = optionalParameter( options.side, THREE.FrontSide );
	this.fog = optionalParameter( options.fog, false );

	this.renderer = renderer;
	this.scene = scene;
	this.mirrorPlane = new THREE.Plane();
	this.normal = new THREE.Vector3( 0, 0, 1 );
	this.mirrorWorldPosition = new THREE.Vector3();
	this.cameraWorldPosition = new THREE.Vector3();
	this.rotationMatrix = new THREE.Matrix4();
	this.lookAtPosition = new THREE.Vector3( 0, 0, - 1 );
	this.clipPlane = new THREE.Vector4();

	if ( camera instanceof THREE.PerspectiveCamera ) {

		this.camera = camera;

	} else {

		this.camera = new THREE.PerspectiveCamera();
		console.log( this.name + ': camera is not a Perspective Camera!' );

	}

	this.textureMatrix = new THREE.Matrix4();

	this.mirrorCamera = this.camera.clone();

	this.renderTarget = new THREE.WebGLRenderTarget( width, height );
	this.renderTarget2 = new THREE.WebGLRenderTarget( width, height );

	var mirrorShader = THREE.ShaderLib[ "water" ];
	var mirrorUniforms = THREE.UniformsUtils.clone( mirrorShader.uniforms );

	this.material = new THREE.ShaderMaterial( {
		fragmentShader: mirrorShader.fragmentShader,
		vertexShader: mirrorShader.vertexShader,
		uniforms: mirrorUniforms,
		transparent: true,
		side: this.side,
		fog: this.fog
	} );

	this.material.uniforms.mirrorSampler.value = this.renderTarget.texture;
	this.material.uniforms.textureMatrix.value = this.textureMatrix;
	this.material.uniforms.alpha.value = this.alpha;
	this.material.uniforms.time.value = this.time;
	this.material.uniforms.normalSampler.value = this.normalSampler;
	this.material.uniforms.sunColor.value = this.sunColor;
	this.material.uniforms.waterColor.value = this.waterColor;
	this.material.uniforms.sunDirection.value = this.sunDirection;
	this.material.uniforms.distortionScale.value = this.distortionScale;

	this.material.uniforms.eye.value = this.eye;

	if ( ! THREE.Math.isPowerOfTwo( width ) || ! THREE.Math.isPowerOfTwo( height ) ) {

		this.renderTarget.texture.generateMipmaps = false;
		this.renderTarget.texture.minFilter = THREE.LinearFilter;
		this.renderTarget2.texture.generateMipmaps = false;
		this.renderTarget2.texture.minFilter = THREE.LinearFilter;

	}

	this.updateTextureMatrix();
	this.render();

};

THREE.Water.prototype = Object.create( THREE.Mirror.prototype );
THREE.Water.prototype.constructor = THREE.Water;


THREE.Water.prototype.updateTextureMatrix = function () {

	function sign( x ) {

		return x ? x < 0 ? - 1 : 1 : 0;

	}

	this.updateMatrixWorld();
	this.camera.updateMatrixWorld();

	this.mirrorWorldPosition.setFromMatrixPosition( this.matrixWorld );
	this.cameraWorldPosition.setFromMatrixPosition( this.camera.matrixWorld );

	this.rotationMatrix.extractRotation( this.matrixWorld );

	this.normal.set( 0, 0, 1 );
	this.normal.applyMatrix4( this.rotationMatrix );

	var view = this.mirrorWorldPosition.clone().sub( this.cameraWorldPosition );
	view.reflect( this.normal ).negate();
	view.add( this.mirrorWorldPosition );

	this.rotationMatrix.extractRotation( this.camera.matrixWorld );

	this.lookAtPosition.set( 0, 0, - 1 );
	this.lookAtPosition.applyMatrix4( this.rotationMatrix );
	this.lookAtPosition.add( this.cameraWorldPosition );

	var target = this.mirrorWorldPosition.clone().sub( this.lookAtPosition );
	target.reflect( this.normal ).negate();
	target.add( this.mirrorWorldPosition );

	this.up.set( 0, - 1, 0 );
	this.up.applyMatrix4( this.rotationMatrix );
	this.up.reflect( this.normal ).negate();

	this.mirrorCamera.position.copy( view );
	this.mirrorCamera.up = this.up;
	this.mirrorCamera.lookAt( target );
	this.mirrorCamera.aspect = this.camera.aspect;

	this.mirrorCamera.updateProjectionMatrix();
	this.mirrorCamera.updateMatrixWorld();
	this.mirrorCamera.matrixWorldInverse.getInverse( this.mirrorCamera.matrixWorld );

	// Update the texture matrix
	this.textureMatrix.set( 0.5, 0.0, 0.0, 0.5,
							0.0, 0.5, 0.0, 0.5,
							0.0, 0.0, 0.5, 0.5,
							0.0, 0.0, 0.0, 1.0 );
	this.textureMatrix.multiply( this.mirrorCamera.projectionMatrix );
	this.textureMatrix.multiply( this.mirrorCamera.matrixWorldInverse );

	// Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
	// Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
	this.mirrorPlane.setFromNormalAndCoplanarPoint( this.normal, this.mirrorWorldPosition );
	this.mirrorPlane.applyMatrix4( this.mirrorCamera.matrixWorldInverse );

	this.clipPlane.set( this.mirrorPlane.normal.x, this.mirrorPlane.normal.y, this.mirrorPlane.normal.z, this.mirrorPlane.constant );

	var q = new THREE.Vector4();
	var projectionMatrix = this.mirrorCamera.projectionMatrix;

	q.x = ( sign( this.clipPlane.x ) + projectionMatrix.elements[ 8 ] ) / projectionMatrix.elements[ 0 ];
	q.y = ( sign( this.clipPlane.y ) + projectionMatrix.elements[ 9 ] ) / projectionMatrix.elements[ 5 ];
	q.z = - 1.0;
	q.w = ( 1.0 + projectionMatrix.elements[ 10 ] ) / projectionMatrix.elements[ 14 ];

	// Calculate the scaled plane vector
	var c = new THREE.Vector4();
	c = this.clipPlane.multiplyScalar( 2.0 / this.clipPlane.dot( q ) );

	// Replacing the third row of the projection matrix
	projectionMatrix.elements[ 2 ] = c.x;
	projectionMatrix.elements[ 6 ] = c.y;
	projectionMatrix.elements[ 10 ] = c.z + 1.0 - this.clipBias;
	projectionMatrix.elements[ 14 ] = c.w;

	var worldCoordinates = new THREE.Vector3();
	worldCoordinates.setFromMatrixPosition( this.camera.matrixWorld );
	this.eye = worldCoordinates;
	this.material.uniforms.eye.value = this.eye;

};

/**
 * @author mrdoob / http://mrdoob.com
 * Based on @tojiro's vr-samples-utils.js
 */

var WEBVR = {

	isLatestAvailable: function () {

		return navigator.getVRDisplays !== undefined;

	},

	isAvailable: function () {

		return navigator.getVRDisplays !== undefined || navigator.getVRDevices !== undefined;

	},

	getMessage: function () {

		var message;

		if ( navigator.getVRDisplays ) {

			navigator.getVRDisplays().then( function ( displays ) {

				if ( displays.length === 0 ) message = 'WebVR supported, but no VRDisplays found.';

			} );

		} else if ( navigator.getVRDevices ) {

			message = 'Your browser supports WebVR but not the latest version. See <a href="http://webvr.info">webvr.info</a> for more info.';

		} else {

			message = 'Your browser does not support WebVR. See <a href="http://webvr.info">webvr.info</a> for assistance.';

		}

		if ( message !== undefined ) {

			var container = document.createElement( 'div' );
			container.style.position = 'absolute';
			container.style.left = '0';
			container.style.top = '0';
			container.style.right = '0';
			container.style.zIndex = '999';
			container.align = 'center';

			var error = document.createElement( 'div' );
			error.style.fontFamily = 'sans-serif';
			error.style.fontSize = '16px';
			error.style.fontStyle = 'normal';
			error.style.lineHeight = '26px';
			error.style.backgroundColor = '#fff';
			error.style.color = '#000';
			error.style.padding = '10px 20px';
			error.style.margin = '50px';
			error.style.display = 'inline-block';
			error.innerHTML = message;
			container.appendChild( error );

			return container;

		}

	},

	getButton: function ( effect ) {

		var button = document.createElement( 'button' );
		button.style.position = 'absolute';
		button.style.left = 'calc(50% - 50px)';
		button.style.bottom = '20px';
		button.style.width = '100px';
		button.style.border = '0';
		button.style.padding = '8px';
		button.style.cursor = 'pointer';
		button.style.backgroundColor = '#000';
		button.style.color = '#fff';
		button.style.fontFamily = 'sans-serif';
		button.style.fontSize = '13px';
		button.style.fontStyle = 'normal';
		button.style.textAlign = 'center';
		button.style.zIndex = '999';
		button.textContent = 'ENTER VR';
		button.onclick = function() {

			effect.isPresenting ? effect.exitPresent() : effect.requestPresent();

		};

		window.addEventListener( 'vrdisplaypresentchange', function ( event ) {

			button.textContent = effect.isPresenting ? 'EXIT VR' : 'ENTER VR';

		}, false );

		return button;

	}

};
