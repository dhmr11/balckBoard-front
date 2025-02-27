import React, { useState, useEffect } from "react";
import * as S from "./style";
import moment from "moment";
import { useParams, Link } from "react-router-dom";
import BlackBoard from "../blackBoard/BlackBoard";
import Button from "../common/button/Button";
import useInnerWidth from "../../hooks/usInnerWidth/useInnerWidth";

function BeforeLaunch({ data, getIsLaunch }) {
  const params = useParams();

  const emSize = (useInnerWidth() / 375) * 10;
  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState({
    day: 0,
    hour: 0,
    minute: 0,
    second: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const timeDiff = moment(data.graduateDate).valueOf() - moment().valueOf();
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      if (timeDiff < 0) {
        getIsLaunch(true);
      }
      setTimeLeft({ day: days, hour: hours, minute: minutes, second: seconds });
      setLoading(false); // 값이 계산되면 로딩을 false로 설정
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [data.graduateDate, getIsLaunch]);

  const handleCopyURL = () => {
    const urlToCopy = window.location.href;
    navigator.clipboard
      .writeText(urlToCopy)
      .then(() => {
        alert("URL이 클립보드에 복사되었습니다: " + urlToCopy);
      })
      .catch(error => {
        console.error("URL 복사에 실패했습니다: " + error);
      });
  };

  return (
    <S.PageWrapper>
      {loading ? (
        // 로딩 중인 경우 로딩 표시
        <S.Loading>Loading...</S.Loading>
      ) : (
        // 값이 로드되면 내용을 렌더링
        <>
          <S.LeftDateWrapper>
            <S.LeftDateAbout>
              <S.LeftDateAbout>칠판 공개까지</S.LeftDateAbout>
              <S.LeftDateContent>
                {timeLeft.day}일 {timeLeft.hour}시간 {timeLeft.minute}분{" "}
                {timeLeft.second}초
              </S.LeftDateContent>
            </S.LeftDateAbout>
            <S.CopyBtn src="/LinkIcon.png" onClick={handleCopyURL} />
          </S.LeftDateWrapper>

          <S.BlackBoardWrapper $emSize={emSize + "px"}>
            <BlackBoard data={data} type={"title"} />
          </S.BlackBoardWrapper>

          <S.FooterWrapper>
            <Link
              to={`/letterCreate/${params.url}`}
              style={{ marginBottom: "5px", width: "100%" }}
            >
              <Button content={"칠판 꾸며주기"} type={"white"} />
            </Link>
            <Link
              to={`/visitors/${params.url}`}
              style={{ marginBottom: "5px", width: "100%" }}
            >
              <Button content={"다녀간 사람"} type={"black"} />
            </Link>

            <Link>
              <S.WantToMakeBtn>
                <div>나도 칠판 만들기</div>
                <span> {">"}</span>
              </S.WantToMakeBtn>
            </Link>

            <S.Wood />
          </S.FooterWrapper>
        </>
      )}
    </S.PageWrapper>
  );
}

export default BeforeLaunch;
