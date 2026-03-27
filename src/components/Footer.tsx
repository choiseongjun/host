import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-card-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-lg font-bold">
              <span className="text-accent">NIGHT</span>
              <span className="text-foreground">GUIDE</span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-muted">
              대한민국 No.1 나이트라이프 가이드.
              <br />
              검증된 업소 정보와 실제 리뷰를 확인하세요.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">카테고리</h3>
            <ul className="mt-3 space-y-2">
              {["룸살롱", "바/라운지", "노래방", "클럽", "호스트바"].map((cat) => (
                <li key={cat}>
                  <Link href="#" className="text-sm text-muted transition-colors hover:text-accent">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">지역</h3>
            <ul className="mt-3 space-y-2">
              {["강남구", "서초구", "마포구", "중구", "용산구"].map((region) => (
                <li key={region}>
                  <Link href="#" className="text-sm text-muted transition-colors hover:text-accent">
                    {region}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">고객지원</h3>
            <ul className="mt-3 space-y-2">
              {["광고 문의", "업소 등록", "이용약관", "개인정보처리방침"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-muted transition-colors hover:text-accent">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-card-border pt-6 text-center text-xs text-muted">
          &copy; 2026 NIGHTGUIDE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
