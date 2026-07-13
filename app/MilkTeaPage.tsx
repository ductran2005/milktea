"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";

import type { Drink, LandingData, Promotion } from "./cms";

type CartItem = {
  id: string;
  drink: Drink;
  size: "M" | "L";
  sugar: string;
  ice: string;
  toppings: string[];
  quantity: number;
  unitPrice: number;
};

const sugarLevels = ["0%", "30%", "50%", "70%", "100%"];
const iceLevels = ["Không đá", "Ít đá", "Bình thường", "Nhiều đá"];

const quickInfo = [
  "Trà ủ mới mỗi ngày",
  "Trân châu nấu tại cửa hàng",
  "Pha theo khẩu vị riêng",
  "Giao nhanh tại Đà Nẵng",
  "Đặt hàng dễ dàng",
  "Nguyên liệu được chọn lọc",
];

const districts = ["Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Liên Chiểu", "Cẩm Lệ"];

const reviews = [
  {
    name: "Minh Anh",
    avatar: "/milktea-assets/reviews/minh-anh.png",
    area: "Hải Châu",
    drink: "Trà sữa đường đen",
    text: "Trà thơm, không quá ngọt. Trân châu mềm và giao hàng khá nhanh.",
  },
  {
    name: "Quốc Huy",
    avatar: "/milktea-assets/reviews/quoc-huy.png",
    area: "Thanh Khê",
    drink: "Matcha kem sữa",
    text: "Matcha thơm, lớp kem sữa béo nhẹ. Bao bì nhìn rất đẹp.",
  },
  {
    name: "Bảo Trân",
    avatar: "/milktea-assets/reviews/bao-tran.png",
    area: "Sơn Trà",
    drink: "Ô long đào",
    text: "Vị thanh, uống mát và hợp để đặt sau giờ học.",
  },
];

function formatPrice(price: number) {
  return `${price.toLocaleString("vi-VN")}đ`;
}

function buildMessage(cart: CartItem[], total: number, promotion: Promotion | null, discount: number) {
  const lines = cart.map(
    (item) =>
      `${item.quantity}x ${item.drink.name} size ${item.size}\n- Đường: ${item.sugar}\n- Đá: ${item.ice}\n- Topping: ${
        item.toppings.length ? item.toppings.join(", ") : "Không thêm"
      }`,
  );

  const promotionLine = promotion
    ? `\nƯu đãi: ${promotion.title}\nGiảm giá tạm tính: ${formatPrice(discount)}`
    : "";

  return encodeURIComponent(
    `Xin chào, tôi muốn đặt:\n\n${lines.join("\n\n")}${promotionLine}\n\nTổng cộng: ${formatPrice(
      total,
    )}\n\nTên khách hàng:\nSố điện thoại:\nĐịa chỉ nhận hàng:`,
  );
}

export default function MilkTeaPage({ data }: { data: LandingData }) {
  const { drinks, toppings: toppingOptions, promotions, store, content } = data;
  const shellRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(drinks.length > 2 ? 2 : 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [size, setSize] = useState<"M" | "L">("M");
  const [sugar, setSugar] = useState("50%");
  const [ice, setIce] = useState("Ít đá");
  const [toppings, setToppings] = useState<string[]>(["Trân châu đen"]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  const activeDrink = drinks[activeIndex];
  const toppingTotal = toppings.reduce((sum, topping) => {
    const item = toppingOptions.find((option) => option.name === topping);
    return sum + (item?.price ?? 0);
  }, 0);
  const customPrice = (size === "M" ? activeDrink.priceM : activeDrink.priceL) + toppingTotal;
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 15000 : 0;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const promotionResult = useMemo(() => {
    if (!selectedPromotion) {
      return { discount: 0, message: "", eligible: false };
    }

    if (cartCount === 0) {
      return { discount: 0, message: "Thêm món vào giỏ để áp dụng ưu đãi.", eligible: false };
    }

    const title = selectedPromotion.title.toLocaleLowerCase("vi");
    const percentMatch = title.match(/(\d+)\s*%/);
    const percent = percentMatch ? Number(percentMatch[1]) : 0;
    const minimumMatch = title.match(/mua\s+(\d+)\s+ly/);
    const minimum = minimumMatch ? Number(minimumMatch[1]) : 0;

    if (title.includes("topping")) {
      const toppingDiscount = cart.reduce((highestPrice, item) => {
        const itemHighestPrice = item.toppings.reduce((highest, toppingName) => {
          const price = toppingOptions.find((option) => option.name === toppingName)?.price ?? 0;
          return Math.max(highest, price);
        }, 0);
        return Math.max(highestPrice, itemHighestPrice);
      }, 0);

      return toppingDiscount > 0
        ? { discount: Math.min(toppingDiscount, subtotal), message: "Đã miễn phí một topping có giá cao nhất.", eligible: true }
        : { discount: 0, message: "Hãy thêm ít nhất một topping để nhận ưu đãi.", eligible: false };
    }

    if (minimum > 0 && cartCount < minimum) {
      return {
        discount: 0,
        message: `Cần thêm ${minimum - cartCount} ly để đủ điều kiện ưu đãi.`,
        eligible: false,
      };
    }

    if (percent > 0) {
      return {
        discount: Math.min(Math.round((subtotal * percent) / 100), subtotal),
        message: title.includes("sinh viên")
          ? "Đã áp dụng tạm tính. Vui lòng xuất trình thẻ sinh viên khi nhận hàng."
          : `Đã giảm ${percent}% giá trị món trong giỏ.`,
        eligible: true,
      };
    }

    return {
      discount: 0,
      message: "Cửa hàng sẽ xác nhận điều kiện ưu đãi khi nhận đơn.",
      eligible: true,
    };
  }, [cart, cartCount, selectedPromotion, subtotal, toppingOptions]);
  const discount = promotionResult.discount;
  const total = Math.max(0, subtotal + deliveryFee - discount);
  const orderMessage = useMemo(
    () => buildMessage(cart, total, selectedPromotion, discount),
    [cart, discount, selectedPromotion, total],
  );

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let cleanup = () => {};

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".hero-carousel",
        { y: 42, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", clearProps: "all" },
      );

      gsap.utils.toArray<HTMLElement>(".reveal:not(.hero-carousel):not(.hero-card)").forEach((element, index) => {
        gsap.fromTo(
          element,
          { y: 54, opacity: 0, clipPath: "inset(12% 0 0 0)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0 0 0)",
            duration: 0.85,
            delay: (index % 3) * 0.04,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 84%" },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".product-card").forEach((card) => {
        gsap.to(card.querySelector("img"), {
          y: -18,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });
      });

      gsap.utils.toArray<HTMLElement>(".story-card").forEach((card, index) => {
        gsap.fromTo(
          card,
          { x: index % 2 ? 28 : -28, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.75, ease: "power2.out", scrollTrigger: { trigger: card, start: "top 78%" } },
        );
      });

      const counter = document.querySelector<HTMLElement>("[data-counter]");
      if (counter) {
        const target = Number(counter.dataset.counter ?? 0);
        const state = { value: 0 };
        gsap.to(state, {
          value: target,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: counter, start: "top 82%" },
          onUpdate: () => {
            counter.textContent = `${state.value.toFixed(1)}/5`;
          },
        });
      }

      cleanup = () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        gsap.killTweensOf("*");
      };
    });

    return () => cleanup();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    import("gsap").then(({ gsap }) => {
      gsap.fromTo(
        ".hero-card",
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.38, ease: "power2.out" },
      );
      gsap.fromTo(".hero-cup.front img", { scale: 0.94 }, { scale: 1, duration: 0.62, ease: "back.out(1.5)" });
    });
  }, [activeIndex]);

  const addToCart = (drink = activeDrink) => {
    const unitPrice = (size === "M" ? drink.priceM : drink.priceL) + toppingTotal;
    const item: CartItem = {
      id: `${drink.id}-${Date.now()}`,
      drink,
      size,
      sugar,
      ice,
      toppings,
      quantity: 1,
      unitPrice,
    };
    setCart((current) => [item, ...current]);
    setCartOpen(true);
  };

  const changeQuantity = (id: string, amount: number) => {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item))
        .filter(Boolean),
    );
  };

  const removeItem = (id: string) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const toggleTopping = (name: string) => {
    setToppings((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
  };

  return (
    <main ref={shellRef} className="site-shell" style={{ "--active-color": activeDrink.color } as CSSProperties}>
      <div className="loading-strip" />
      <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
        <a className="brand" href="#trang-chu" aria-label={`Trang chủ ${store.name}`}>
          <strong>{store.name}</strong>
          <span>{content.heroTitle}</span>
        </a>

        <nav className={`nav-links ${menuOpen ? "is-open" : ""}`} aria-label="Điều hướng chính">
          <a href="#trang-chu" onClick={() => setMenuOpen(false)}>Trang chủ</a>
          <a href="#menu" onClick={() => setMenuOpen(false)}>Menu</a>
          <a href="#tao-ly" onClick={() => setMenuOpen(false)}>Tự tạo ly</a>
          <a href="#uu-dai" onClick={() => setMenuOpen(false)}>Ưu đãi</a>
          <a href="#cua-hang" onClick={() => setMenuOpen(false)}>Cửa hàng</a>
          <a href="#lien-he" onClick={() => setMenuOpen(false)}>Liên hệ</a>
        </nav>

        <div className="header-actions">
          <button className="cart-button" type="button" onClick={() => setCartOpen(true)} aria-label="Mở giỏ hàng">
            Giỏ hàng <span>{cartCount}</span>
          </button>
          <a className="primary-button" href="#tao-ly">{content.ctaButton}</a>
          <button className="menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Mở menu">
            ☰
          </button>
        </div>
      </header>

      <section className="hero-section" id="trang-chu">
        <span className="hero-glow" />
        <span className="hero-pearl pearl-one" />
        <span className="hero-pearl pearl-two" />
        <span className="hero-leaf" />
        <div className="hero-carousel reveal" aria-label="Bộ sưu tập trà sữa">
          {drinks.map((drink, index) => {
            const offset = (index - activeIndex + drinks.length) % drinks.length;
            const position = offset === 0 ? "front" : offset === 1 ? "right" : "left";
            return (
              <button
                className={`hero-cup ${position}`}
                key={drink.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Chọn ${drink.name}`}
              >
                <Image
                  src={drink.image}
                  alt={drink.name}
                  width={943}
                  height={1668}
                  priority={index === activeIndex}
                  sizes="(max-width: 760px) 62vw, (max-width: 1120px) 42vw, 31vw"
                />
              </button>
            );
          })}
          <button className="next-drink" type="button" onClick={() => setActiveIndex((activeIndex + 1) % drinks.length)}>
            Món tiếp theo
          </button>
        </div>

        <aside className="hero-card reveal">
          <span>{activeDrink.badge}</span>
          <p className="hero-card-index">0{activeIndex + 1}</p>
          <h3>{activeDrink.name}</h3>
          <p>{activeDrink.description}</p>
          <div className="hero-card-price">
            <strong>{formatPrice(activeDrink.priceM)}</strong>
            <small>size M</small>
          </div>
          <ul>
            {activeDrink.ingredients.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <button className="secondary-button" type="button" onClick={() => addToCart(activeDrink)}>
            Thêm vào giỏ
          </button>
        </aside>
      </section>

      <section className="marquee-section" aria-label="Thông tin nhanh">
        <div>
          {[...quickInfo, ...quickInfo].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </section>

      <section className="section-block menu-section" id="menu">
        <div className="section-heading reveal">
          <p className="eyebrow">Menu bán chạy</p>
          <h2>Hôm nay uống gì?</h2>
          <p>Khám phá những món trà sữa được yêu thích nhất tại cửa hàng.</p>
        </div>
        <div className="product-grid">
          {drinks.map((drink, index) => (
              <article className="product-card reveal" key={drink.id} style={{ "--card-color": drink.color } as CSSProperties}>
              <span className="badge">{drink.badge}</span>
              <button className="product-image" type="button" onClick={() => setActiveIndex(index)} aria-label={`Xem ${drink.name}`}>
                <Image src={drink.image} alt={drink.name} width={943} height={1668} />
              </button>
              <h3>{drink.name}</h3>
              <p>{drink.description}</p>
              <div className="size-row">
                <span>Size M: {formatPrice(drink.priceM)}</span>
                <span>Size L: {formatPrice(drink.priceL)}</span>
              </div>
              <div className="card-actions">
                <button type="button" onClick={() => setActiveIndex(index)}>Xem nhanh</button>
                <button type="button" onClick={() => addToCart(drink)}>Thêm vào giỏ hàng</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block builder-section" id="tao-ly">
        <div className="builder-preview reveal">
          <p className="eyebrow">Tạo ly theo gu của bạn</p>
          <h2>Mỗi người một gu, mỗi ly một cách pha</h2>
          <Image src={activeDrink.image} alt={activeDrink.name} width={943} height={1668} />
        </div>

        <div className="builder-panel reveal">
          <div className="choice-group">
            <h3>Chọn size</h3>
            {(["M", "L"] as const).map((item) => (
              <button className={size === item ? "is-active" : ""} key={item} type="button" onClick={() => setSize(item)}>
                Size {item}
              </button>
            ))}
          </div>

          <div className="choice-group">
            <h3>Chọn mức đường</h3>
            {sugarLevels.map((item) => (
              <button className={sugar === item ? "is-active" : ""} key={item} type="button" onClick={() => setSugar(item)}>
                {item}
              </button>
            ))}
          </div>

          <div className="choice-group">
            <h3>Chọn lượng đá</h3>
            {iceLevels.map((item) => (
              <button className={ice === item ? "is-active" : ""} key={item} type="button" onClick={() => setIce(item)}>
                {item}
              </button>
            ))}
          </div>

          <div className="choice-group topping-group">
            <h3>Chọn topping</h3>
            {toppingOptions.map((item) => (
              <button
                className={toppings.includes(item.name) ? "is-active" : ""}
                key={item.name}
                type="button"
                onClick={() => toggleTopping(item.name)}
              >
                {item.name} +{formatPrice(item.price)}
              </button>
            ))}
          </div>

          <div className="builder-total">
            <span>Tạm tính</span>
            <strong>{formatPrice(customPrice)}</strong>
          </div>
          <button className="wide-button" type="button" onClick={() => addToCart(activeDrink)}>
            Thêm ly này vào giỏ hàng
          </button>
        </div>
      </section>

      <section className="section-block ingredient-section" id="nguyen-lieu">
        <div className="section-heading reveal">
          <p className="eyebrow">Câu chuyện nguyên liệu</p>
          <h2>{content.storyTitle}</h2>
          <p>{content.storyDesc}</p>
        </div>
        <div className="story-grid">
          {[
            ["01", "Ủ trà mới mỗi mẻ", "Lá trà được ủ theo nhiệt độ và thời gian phù hợp để giữ trọn hương thơm."],
            ["02", "Nấu trân châu mỗi ngày", "Trân châu được nấu theo từng mẻ nhỏ để luôn mềm, dẻo và thơm."],
            ["03", "Pha theo khẩu vị của bạn", "Mỗi ly được pha sau khi khách đặt, tùy chỉnh đường, đá và topping."],
          ].map(([number, title, text]) => (
            <article className="story-card reveal" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block promo-section" id="uu-dai">
        <div className="section-heading reveal">
          <p className="eyebrow">Ưu đãi dành cho khách Đà Nẵng</p>
          <h2>Ưu đãi hôm nay</h2>
          <p>Nội dung ưu đãi là dữ liệu mẫu để chủ cửa hàng chỉnh sửa trước khi chạy thật.</p>
        </div>
        <div className="promo-grid">
          {promotions.map((promotion) => (
            <article
              className={`promo-card reveal ${selectedPromotion?.title === promotion.title ? "is-selected" : ""}`}
              key={promotion.title}
            >
              <span>{promotion.label}</span>
              <h3>{promotion.title}</h3>
              <p>{promotion.date}</p>
              <button
                type="button"
                aria-pressed={selectedPromotion?.title === promotion.title}
                onClick={() => {
                  setSelectedPromotion(promotion);
                  setCartOpen(true);
                }}
              >
                {selectedPromotion?.title === promotion.title ? "Đã chọn ưu đãi" : "Sử dụng ưu đãi"}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block review-section">
        <div className="review-summary reveal">
          <p className="eyebrow">Đánh giá demo</p>
          <h2>Được yêu thích bởi những tín đồ trà sữa</h2>
          <div className="rating-box">
            <strong data-counter="4.8">4.8/5</strong>
            <span>Dữ liệu đánh giá minh họa</span>
          </div>
        </div>
        <div className="review-list">
          {reviews.map((review) => (
            <article className="review-card reveal" key={review.name}>
              <Image
                className="avatar"
                src={review.avatar}
                width={54}
                height={54}
                alt=""
              />
              <p>“{review.text}”</p>
              <strong>{review.name} — {review.area}</strong>
              <span>Món đã gọi: {review.drink}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block delivery-section" id="lien-he">
        <div className="delivery-copy reveal">
          <p className="eyebrow">Khu vực giao hàng</p>
          <h2>Giao trà tận nơi tại Đà Nẵng</h2>
          <p>
            Giao nhanh nội thành. Phí giao hàng có thể áp dụng theo khoảng cách. Hỗ trợ đặt qua Zalo,
            Messenger và các nền tảng giao hàng nếu cửa hàng có gian hàng.
          </p>
          <div className="district-list">
            {districts.map((district) => (
              <span key={district}>{district}</span>
            ))}
          </div>
        </div>
        <form className="quick-form reveal">
          <input placeholder="Họ và tên" />
          <input placeholder="Số điện thoại" />
          <input placeholder="Địa chỉ nhận hàng" />
          <select defaultValue="">
            <option value="" disabled>Chọn quận</option>
            {districts.map((district) => (
              <option key={district}>{district}</option>
            ))}
          </select>
          <textarea placeholder="Ghi chú đơn hàng" />
          <select defaultValue="Thanh toán khi nhận hàng">
            <option>Thanh toán khi nhận hàng</option>
            <option>Chuyển khoản</option>
          </select>
        </form>
      </section>

      <section className="section-block store-section" id="cua-hang">
        <div className="store-map reveal">
          {/* Đổi địa chỉ trong q=... thành địa chỉ cửa hàng thật của bạn */}
          <iframe
            title="Bản đồ cửa hàng AURATEA"
            src="https://www.google.com/maps?q=Đà%20Nẵng,%20Việt%20Nam&z=14&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <div className="store-info reveal">
          <p className="eyebrow">Cửa hàng</p>
          <h2>Ghé cửa hàng và thưởng thức một ly thật chill</h2>
          <ul>
            <li>Địa chỉ: {store.address}</li>
            <li>Giờ mở cửa: {store.hours}</li>
            <li>Số điện thoại: {store.phone}</li>
            <li>Email: {store.email}</li>
          </ul>
          <a
            className="secondary-button"
            href="https://www.google.com/maps?q=Đà%20Nẵng,%20Việt%20Nam"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chỉ đường
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <a className="brand" href="#trang-chu">
            <strong>{store.name}</strong>
            <span>{content.heroTitle}</span>
          </a>
          <p>{content.heroDesc}</p>
        </div>
        <div>
          <h3>Liên kết</h3>
          <a href="#trang-chu">Trang chủ</a>
          <a href="#menu">Menu</a>
          <a href="#uu-dai">Ưu đãi</a>
          <a href="#cua-hang">Cửa hàng</a>
        </div>
        <div>
          <h3>Liên hệ</h3>
          <p>{store.address}</p>
          <p>{store.phone}</p>
          <p>{store.email}</p>
          <p>{store.hours}</p>
        </div>
        <div>
          <h3>Mạng xã hội</h3>
          <p>Facebook · Instagram · TikTok · Zalo</p>
          <p>GrabFood · ShopeeFood</p>
          <p>Chính sách bảo mật · Chính sách giao hàng · Điều khoản sử dụng</p>
        </div>
      </footer>

      <button className="mobile-order" type="button" onClick={() => setCartOpen(true)}>
        Đặt hàng · {cartCount} món
      </button>

      <aside className={`cart-drawer ${cartOpen ? "is-open" : ""}`} aria-hidden={!cartOpen}>
        <div className="cart-head">
          <h2>Giỏ hàng</h2>
          <button type="button" onClick={() => setCartOpen(false)}>Đóng</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <p>Giỏ hàng đang trống. Hãy chọn một ly trà bạn thích nhé.</p>
          ) : (
            cart.map((item) => (
              <article className="cart-item" key={item.id}>
                <Image src={item.drink.image} alt={item.drink.name} width={180} height={260} />
                <div>
                  <h3>{item.drink.name}</h3>
                  <p>Size {item.size} · Đường {item.sugar} · {item.ice}</p>
                  <p>Topping: {item.toppings.length ? item.toppings.join(", ") : "Không thêm"}</p>
                  <strong>{formatPrice(item.unitPrice * item.quantity)}</strong>
                  <div className="quantity-row">
                    <button type="button" onClick={() => changeQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => changeQuantity(item.id, 1)}>+</button>
                    <button type="button" onClick={() => removeItem(item.id)}>Xóa</button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
        <div className="cart-summary">
          {selectedPromotion && (
            <div className={`applied-promotion ${promotionResult.eligible ? "is-eligible" : ""}`} role="status">
              <div>
                <span>Ưu đãi đang chọn</span>
                <strong>{selectedPromotion.title}</strong>
              </div>
              <p>{promotionResult.message}</p>
              <button type="button" onClick={() => setSelectedPromotion(null)}>Bỏ ưu đãi</button>
            </div>
          )}
          <p><span>Tạm tính</span><strong>{formatPrice(subtotal)}</strong></p>
          <p><span>Phí giao hàng</span><strong>{formatPrice(deliveryFee)}</strong></p>
          <p><span>Giảm giá</span><strong>{formatPrice(discount)}</strong></p>
          <p><span>Tổng tiền</span><strong>{formatPrice(total)}</strong></p>
          <a className="wide-button" href={`https://zalo.me/[SO_DIEN_THOAI_ZALO]?text=${orderMessage}`}>
            Tiến hành đặt hàng
          </a>
        </div>
      </aside>
      {cartOpen && <button className="drawer-backdrop" type="button" aria-label="Đóng giỏ hàng" onClick={() => setCartOpen(false)} />}
    </main>
  );
}
